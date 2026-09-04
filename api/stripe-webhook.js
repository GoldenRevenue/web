import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Vercel debe entregarnos el body sin parsear para poder verificar la firma de Stripe.
export const config = {
  api: {
    bodyParser: false,
  },
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

// price_id de Stripe -> archivo correspondiente en el bucket de R2.
// Los nombres de archivo deben coincidir exactamente con lo que se suba al bucket.
function getDeliverables() {
  return {
    [process.env.STRIPE_PRICE_BASE]: {
      label: 'Plantilla Golden Revenue + guía de instalación',
      key: '02_sirviendo_chimenea_fincavinoa.mp4',
    },
    [process.env.STRIPE_PRICE_LIQUIDS]: {
      label: '+180 archivos .liquid',
      key: '03_brindis_cenital_quintaluna.mp4',
    },
    [process.env.STRIPE_PRICE_EBOOK]: {
      label: 'Ebook premium',
      key: '04_tres_botellas_chimenea.mp4',
    },
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

async function sendDeliveryEmail(toEmail, items) {
  const linksHtml = items
    .map((item) => `<li><strong>${item.label}</strong>: <a href="${item.url}">Descargar</a></li>`)
    .join('')

  await transporter.sendMail({
    from: `"Golden Revenue" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Tu compra en Golden Revenue — enlaces de descarga',
    html: `
      <p>¡Gracias por tu compra!</p>
      <p>Aquí tienes tus enlaces de descarga (válidos durante 72 horas):</p>
      <ul>${linksHtml}</ul>
      <p>Si algún enlace ha caducado, responde a este correo y te lo reenviamos.</p>
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
    const rawBody = await readRawBody(req)
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
        .map((li) => deliverables[li.price?.id])
        .filter(Boolean)

      const customerEmail = session.customer_details?.email

      if (customerEmail && purchased.length > 0) {
        const items = await Promise.all(
          purchased.map(async (item) => ({
            label: item.label,
            url: await signedDownloadUrl(item.key),
          }))
        )
        await sendDeliveryEmail(customerEmail, items)
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
