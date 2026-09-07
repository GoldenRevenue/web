import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { buffer } from 'micro'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Vercel debe entregarnos el body sin parsear para poder verificar la firma de Stripe.
export const config = {
  api: {
    bodyParser: false,
  },
}

// price_id de Stripe -> archivo(s) correspondientes en el bucket de R2.
// Los nombres de archivo (key) deben coincidir EXACTAMENTE con lo subido al bucket.
// Si en una misma compra se marcan varios extras, sus archivos se añaden todos
// al mismo email (no hace falta lógica aparte para "todo junto").
function getDeliverables() {
  return {
    [process.env.STRIPE_PRICE_BASE]: [
      { category: 'base', label: 'Plantilla Golden Revenue (.zip)', key: 'Plantilla Golden Revenue.zip' },
      { category: 'base', label: 'Guía de instalación (PDF)', key: 'Guia Golden Revenue.pdf' },
    ],
    [process.env.STRIPE_PRICE_LIQUIDS]: [
      { category: 'liquids', label: '+180 archivos .liquid (.rar)', key: 'golden-revenue2ç.rar' },
    ],
    [process.env.STRIPE_PRICE_EBOOK]: [
      { category: 'ebook', label: 'Ebook premium (PDF)', key: 'Golden_Revenue_eBook_Premium.pdf' },
    ],
  }
}

// Textos del email según lo que se haya comprado, siguiendo la plantilla
// aprobada ("Textos golden revenue.pdf"). "Plantilla" y "Pack completo" son
// los dos casos que cubre esa plantilla tal cual; el resto de combinaciones
// (plantilla + un solo extra) mezclan las mismas frases de forma coherente.
function buildEmailCopy({ hasLiquids, hasEbook }) {
  const bullets = [
    '✅ Plantilla Golden Revenue',
    '✅ Guía básica de instalación',
    ...(hasLiquids ? ['✅ Pack de +180 archivos .liquid'] : []),
    ...(hasEbook ? ['✅ Ebook premium'] : []),
  ]

  if (hasLiquids && hasEbook) {
    return {
      intro:
        'Gracias por confiar en Golden Revenue y por apostar por el pack completo, todo lo que necesitas para llevar tu tienda al siguiente nivel.',
      access: 'Tu compra se ha procesado correctamente y ya tienes acceso a todos los archivos, listos para descargar e instalar.',
      bullets,
      steps: [
        'Descarga todos los archivos desde el enlace que te enviamos.',
        'Instala la plantilla siguiendo la guía paso a paso.',
        'Añade los archivos .liquid que necesites para personalizar tu tema.',
        'Lee el ebook premium para sacarle el máximo partido a tu tienda.',
      ],
      doubtsText: 'Si tienes cualquier duda durante el proceso, escríbenos y te ayudamos encantados.',
    }
  }

  if (hasLiquids) {
    return {
      intro:
        'Gracias por confiar en Golden Revenue y por dar este paso para llevar tu tienda al siguiente nivel, sumando también el pack de +180 archivos .liquid a tu proyecto.',
      access: 'Tu compra se ha procesado correctamente y ya tienes acceso a tu plantilla de Shopify y a tu archivo .rar, listos para descargar e instalar.',
      bullets,
      steps: [
        'Descarga tus archivos desde el enlace que te enviamos.',
        'Instala la plantilla siguiendo la guía paso a paso.',
        'Sube los archivos .liquid a tu tema de Shopify según los necesites.',
      ],
      doubtsText: 'Si tienes cualquier duda durante la instalación o sobre cómo usar los archivos, escríbenos y te ayudamos encantados.',
    }
  }

  if (hasEbook) {
    return {
      intro:
        'Gracias por confiar en Golden Revenue y por dar este paso para llevar tu tienda al siguiente nivel, sumando también el ebook premium a tu proyecto.',
      access: 'Tu compra se ha procesado correctamente y ya tienes acceso a tu plantilla de Shopify y a tu ebook, listos para descargar e instalar.',
      bullets,
      steps: [
        'Descarga tus archivos desde el enlace que te enviamos.',
        'Instala la plantilla siguiendo la guía paso a paso.',
        'Lee el ebook premium para sacarle el máximo partido a tu tienda.',
      ],
      doubtsText: 'Si tienes cualquier duda durante la instalación o sobre el contenido del ebook, escríbenos y te ayudamos encantados.',
    }
  }

  return {
    intro: 'Gracias por confiar en Golden Revenue y por dar este paso para llevar tu tienda al siguiente nivel.',
    access:
      'Tu compra se ha procesado correctamente y ya tienes acceso a tu plantilla de Shopify, lista para instalar y empezar a vender con un diseño profesional que convierte.',
    extraNote: 'Si añadiste algún extra (los +180 archivos .liquid o el ebook premium), también los encontrarás en tu área de descargas.',
    bullets,
    steps: [
      'Descarga tus archivos desde el enlace que te enviamos.',
      'Sigue la guía de instalación paso a paso.',
      'Personaliza tu tienda y empieza a vender.',
    ],
    doubtsText: 'Si tienes cualquier duda durante la instalación, escríbenos y te ayudamos encantados.',
  }
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function signedDownloadUrl(key) {
  const command = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key })
  return getSignedUrl(r2, command, { expiresIn: 60 * 60 * 72 }) // 72h
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

async function sendDeliveryEmail(toEmail, items, { hasLiquids, hasEbook }) {
  const copy = buildEmailCopy({ hasLiquids, hasEbook })

  const bulletsHtml = copy.bullets.map((b) => `<li>${b}</li>`).join('')
  const stepsHtml = copy.steps.map((s) => `<li>${s}</li>`).join('')
  const linksHtml = items
    .map((item) => `<li><strong>${item.label}</strong>: <a href="${item.url}">Descargar</a></li>`)
    .join('')

  // Los clientes de correo no pueden cargar rutas relativas ni archivos locales,
  // solo URLs públicas — el logo se sirve desde el bucket público de R2.
  const logoUrl = 'https://pub-97c92057127448d6861e707a0434fd46.r2.dev/golden-revenue-logo.png'

  await transporter.sendMail({
    from: `"Golden Revenue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '¡Gracias por tu compra! 🎉',
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; padding: 24px 0;">
          <img src="${logoUrl}" alt="Golden Revenue" width="160" style="display: inline-block;" />
        </div>
        <p>¡Hola!</p>
        <p>${copy.intro}</p>
        <p>${copy.access}</p>
        ${copy.extraNote ? `<p>${copy.extraNote}</p>` : ''}
        <p><strong>¿Qué incluye tu pedido?</strong></p>
        <ul>${bulletsHtml}</ul>
        <p><strong>¿Y ahora qué?</strong></p>
        <ol>${stepsHtml}</ol>
        <p><strong>Tus enlaces de descarga</strong> (válidos durante 72 horas):</p>
        <ul>${linksHtml}</ul>
        <p>${copy.doubtsText}</p>
        <p>Gracias de nuevo por elegir Golden Revenue. ¡Mucho éxito con tu tienda!</p>
        <p>Un saludo,<br />El equipo de Golden Revenue</p>
      </div>
    `,
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed')
    return
  }

  const signature = req.headers['stripe-signature']
  let event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      })
      const deliverables = getDeliverables()

      const purchased = lineItems.data
        .flatMap((li) => deliverables[li.price?.id] || [])

      const hasLiquids = purchased.some((item) => item.category === 'liquids')
      const hasEbook = purchased.some((item) => item.category === 'ebook')

      const customerEmail = session.customer_details?.email

      if (customerEmail && purchased.length > 0) {
        const items = await Promise.all(
          purchased.map(async (item) => ({
            label: item.label,
            url: await signedDownloadUrl(item.key),
          }))
        )
        await sendDeliveryEmail(customerEmail, items, { hasLiquids, hasEbook })
      } else {
        console.error('Falta email de cliente o no hay archivos que entregar', session.id)
      }
    } catch (err) {
      console.error('Error procesando checkout.session.completed:', err)
      res.status(500).send('Error interno')
      return
    }
  }

  res.status(200).json({ received: true })
}
