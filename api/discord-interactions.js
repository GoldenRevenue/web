import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from "discord-interactions";
import { Redis } from "@upstash/redis";

// Nombres exactos de las variables creadas por la integración de Upstash
// (prefijo "GOLDEN_KV" elegido al conectar la base de datos)
const redis = new Redis({
  url: process.env.GOLDEN_KV_KV_REST_API_URL,
  token: process.env.GOLDEN_KV_KV_REST_API_TOKEN,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const {
  DISCORD_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  DISCORD_ROLE_ID,
} = process.env;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Asigna el rol de cliente a un usuario de Discord vía la API REST
async function assignClientRole(userId) {
  const url = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${DISCORD_ROLE_ID}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const rawBody = await readRawBody(req);

  const isValid = verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
  if (!isValid) {
    return res.status(401).send("Bad request signature");
  }

  const interaction = JSON.parse(rawBody.toString());

  // 1) Discord comprueba que el endpoint está vivo
  if (interaction.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  // 2) El usuario pulsa el botón "Verificar compra" -> abrimos el modal (formulario)
  if (
    interaction.type === InteractionType.MESSAGE_COMPONENT &&
    interaction.data.custom_id === "abrir_verificacion"
  ) {
    return res.status(200).json({
      type: InteractionResponseType.MODAL,
      data: {
        custom_id: "modal_verificacion",
        title: "Verifica tu compra",
        components: [
          {
            type: 1, // Action row
            components: [
              {
                type: 4, // Text input
                custom_id: "email_compra",
                label: "Email usado en la compra",
                style: 1, // short
                placeholder: "tu@email.com",
                required: true,
              },
            ],
          },
        ],
      },
    });
  }

  // 3) El usuario envía el modal con su email
  if (
    interaction.type === InteractionType.MODAL_SUBMIT &&
    interaction.data.custom_id === "modal_verificacion"
  ) {
    const email = interaction.data.components[0].components[0].value
      .trim()
      .toLowerCase();
    const userId = interaction.member.user.id;

    const purchase = await redis.get(`purchase:${email}`);

    if (purchase && purchase.paid) {
      const ok = await assignClientRole(userId);
      return res.status(200).json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: ok
            ? "✅ ¡Compra verificada! Ya tienes acceso a los canales de cliente 🟢"
            : "⚠️ Verificamos tu compra pero hubo un error asignando el rol. Contacta con el staff en #soporte-tecnico.",
          flags: 64, // ephemeral: solo lo ve quien lo pulsa
        },
      });
    }

    return res.status(200).json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          "❌ No hemos encontrado ninguna compra con ese email. Revisa que sea el mismo que usaste en el checkout, o contacta con el staff en #soporte-tecnico si crees que es un error.",
        flags: 64,
      },
    });
  }

  return res.status(400).send("Unhandled interaction type");
}
