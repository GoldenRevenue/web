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
      { label: 'Plantilla Golden Revenue (.zip)', key: 'Plantilla Golden Revenue.zip' },
      { label: 'Guía de instalación (PDF)', key: 'Guia Golden Revenue.pdf' },
    ],
    [process.env.STRIPE_PRICE_LIQUIDS]: [
      { label: '+180 archivos .liquid (.rar)', key: 'golden-revenue2ç.rar' },
    ],
    [process.env.STRIPE_PRICE_EBOOK]: [
      { label: 'Ebook premium (PDF)', key: 'Golden_Revenue_eBook_Premium.pdf' },
    ],
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

async function sendDeliveryEmail(toEmail, items, siteUrl) {
  const linksHtml = items
    .map((item) => `<li><strong>${item.label}</strong>: <a href="${item.url}">Descargar</a></li>`)
    .join('')

  // El logo se sirve desde /public (vía SITE_URL) porque los clientes de correo
  // no pueden cargar rutas relativas ni archivos locales, solo URLs públicas.
  const logoUrl = `${siteUrl}/brand/golden-revenue-logo.png`

  await transporter.sendMail({
    from: `"Golden Revenue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Tu compra en Golden Revenue — enlaces de descarga',
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; padding: 24px 0;">
          <img src="${logoUrl}" alt="Golden Revenue" width="160" style="display: inline-block;" />
        </div>
        <p>¡Gracias por tu compra!</p>
        <p>Aquí tienes tus enlaces de descarga (válidos durante 72 horas):</p>
        <ul>${linksHtml}</ul>
        <p>Si algún enlace ha caducado, responde a este correo y te lo reenviamos.</p>
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

      const customerEmail = session.customer_details?.email

      if (customerEmail && purchased.length > 0) {
        const items = await Promise.all(
          purchased.map(async (item) => ({
            label: item.label,
            url: await signedDownloadUrl(item.key),
          }))
        )
        const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`
        await sendDeliveryEmail(customerEmail, items, siteUrl)
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
