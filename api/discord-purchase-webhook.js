import Stripe from "stripe";
import { Redis } from "@upstash/redis";

// Nombres exactos de las variables creadas por la integración de Upstash
// (prefijo "GOLDEN_KV" elegido al conectar la base de datos)
const redis = new Redis({
  url: process.env.GOLDEN_KV_KV_REST_API_URL,
  token: process.env.GOLDEN_KV_KV_REST_API_TOKEN,
});

export const config = {
  api: {
    bodyParser: false, // Stripe necesita el cuerpo "en crudo" para verificar la firma
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Lee el cuerpo de la petición como Buffer, sin depender de librerías extra
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_DISCORD_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Firma de Stripe inválida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Nos interesa cuando el pago se completa
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = (session.customer_details?.email || session.customer_email || "")
      .trim()
      .toLowerCase();

    if (email) {
      // Guardamos el email como "cliente verificado" en Vercel KV
      // Guardamos también qué compró, por si en el futuro quieres diferenciar algo
      await redis.set(`purchase:${email}`, {
        paid: true,
        amount_total: session.amount_total,
        currency: session.currency,
        session_id: session.id,
        created: Date.now(),
      });
      console.log(`✅ Compra registrada para ${email}`);
    } else {
      console.warn("⚠️ checkout.session.completed sin email asociado");
    }
  }

  return res.status(200).json({ received: true });
}
