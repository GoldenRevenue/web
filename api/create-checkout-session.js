import Stripe from 'stripe'
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
 
  const { liquids, ebook } = req.body || {}
 
  const line_items = [{ price: process.env.STRIPE_PRICE_BASE, quantity: 1 }]
  if (liquids) line_items.push({ price: process.env.STRIPE_PRICE_LIQUIDS, quantity: 1 })
  if (ebook) line_items.push({ price: process.env.STRIPE_PRICE_EBOOK, quantity: 1 })
 
  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`
 
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${siteUrl}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#precio`,
      // Managed Payments (gestión automática de impuestos) viene activado por
      // defecto en cuentas nuevas de Stripe y exige un tax_code por producto.
      // Lo desactivamos: no lo necesitamos para este caso.
      managed_payments: { enabled: false },
      // Permite que el cliente introduzca un código de afiliado/promoción
      allow_promotion_codes: true,
    })
 
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('create-checkout-session error:', err.message)
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' })
  }
}
 
