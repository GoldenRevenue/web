# Estado del proyecto — Cobro con Stripe (Golden Revenue)

Última revisión: 2026-09-04.

## Auditoría de seguridad (código activo en producción)

Revisado línea por línea `api/create-checkout-session.js`, `api/stripe-webhook.js`, `vercel.json`, `.gitignore` e historial completo de git.

**Correcto / sin hallazgos:**
- El webhook verifica la firma de Stripe (`stripe.webhooks.constructEvent`) antes de hacer nada — sin la clave `STRIPE_WEBHOOK_SECRET` (que solo vive en variables de entorno de Vercel) nadie puede simular un pago falso.
- Ningún dato que decide qué se entrega (producto comprado, email del comprador) viene del navegador — todo se lee de la sesión de Stripe ya verificada.
- Los enlaces de descarga son URLs firmadas de R2 con caducidad de 72h, generadas en el momento por el webhook — no hay URLs públicas permanentes en el código.
- `gracias.html` no expone ni sirve ningún archivo, solo un mensaje — nada que un atacante pueda "encontrar" ahí.
- `.gitignore` excluye `.env*` correctamente. Revisado **todo el historial de git**: nunca se ha commiteado ningún archivo `.env` real ni ningún secreto — solo `.env.example`, que contiene placeholders, sin valores reales.
- Cabeceras de seguridad en `vercel.json` (CSP, HSTS, X-Frame-Options, nosniff, Permissions-Policy) presentes y coherentes con que no cargamos Stripe.js en el cliente (todo pasa por nuestro propio `/api`).
- Los endpoints (`create-checkout-session`, `stripe-webhook`) solo aceptan `POST`, rechazan cualquier otro método.

**⚠️ Hallazgo crítico — acción pendiente (ver más abajo):**
El bucket de Cloudflare R2 (`ecom`) está configurado como **público**. Mientras siga así, **toda la seguridad del webhook y de las URLs firmadas es papel mojado**: si alguien consigue o adivina la URL pública de un archivo (r2.dev o dominio conectado), puede descargarlo directamente sin pasar por Stripe ni pagar nada. Es la única pieza que queda por cerrar del modelo de seguridad que diseñamos.

**Nota menor (no urgente):** el token de API de R2 que se pegó en el chat durante la configuración quedó registrado en texto plano en esta conversación. No es una vulnerabilidad de la web en sí, pero antes de pasar a producción real conviene revocarlo en Cloudflare y generar uno nuevo.

---

## ✅ Qué está hecho

- **Frontend**: botón "Comprar ahora" en `Pricing.jsx` conectado a Stripe Checkout (crea sesión con la plantilla base + extras marcados).
- **`api/create-checkout-session.js`**: crea la sesión de pago en Stripe. Corregido el error de "Managed Payments" (impuestos automáticos) desactivándolo explícitamente — sin este arreglo todos los pagos fallaban con error 500.
- **`api/stripe-webhook.js`**: verifica el pago, identifica qué se compró, genera enlaces temporales de R2 (72h) y prepara el envío del email.
- **`gracias.html`**: página de confirmación propia, sin exponer nada sensible.
- **Stripe (sandbox/test)**:
  - 3 productos/precios creados: Plantilla (`STRIPE_PRICE_BASE`), +180 liquids (`STRIPE_PRICE_LIQUIDS`), Ebook (`STRIPE_PRICE_EBOOK`).
  - Webhook creado apuntando a `https://goldenrevenue.vercel.app/api/stripe-webhook`, escuchando `checkout.session.completed`.
- **Cloudflare R2**: bucket `ecom` creado, credenciales de API generadas, 5 vídeos de prueba subidos (mapeados provisionalmente a los 3 productos en `api/stripe-webhook.js` para poder probar el flujo).
- **Vercel**: todas las variables de Stripe y R2 añadidas a Environment Variables; el proyecto está conectado a GitHub (`GoldenRevenue/web`, rama `main`) con despliegue automático en cada push.
- **Verificado**: la creación de la sesión de pago funciona en producción tras el arreglo de Managed Payments.

## 🔲 Qué falta por hacer

Por prioridad:

1. **🔴 Volver el bucket de R2 (`ecom`) a privado.** Cloudflare → R2 → bucket `ecom` → Settings → desactivar "Public Access" / r2.dev subdomain, y quitar cualquier dominio propio conectado en modo público. **Sin esto, cualquiera puede saltarse el pago si consigue la URL directa del archivo.**
2. **Probar el flujo completo de nuevo** ahora que el bucket sea privado, con tarjeta de test (`4242 4242 4242 4242`), y confirmar que llega a "Pago confirmado".
3. **Generar y añadir `EMAIL_USER` / `EMAIL_APP_PASSWORD`** (contraseña de aplicación de Gmail) en Vercel — sin esto el pago funciona pero el email con los enlaces no se envía (el webhook falla en ese punto y Stripe lo marca como reintento).
4. **Confirmar en Stripe** (Developers → Webhooks → tu endpoint) que las llamadas al webhook responden `200 OK` una vez esté el email configurado.
5. **Sustituir los archivos de prueba** por los definitivos: subir los PDFs/vídeos/zips reales al bucket (ya privado) y actualizar las claves (`key: '...'`) en `getDeliverables()` dentro de `api/stripe-webhook.js` para que apunten a los nombres de archivo reales.
6. **Revocar y regenerar el token de API de R2** que quedó pegado en el chat, antes de ir a producción real.
7. **Pasar a modo Live cuando todo lo anterior esté validado**:
   - Activar cuenta de Stripe (datos fiscales/bancarios).
   - Crear los 3 productos otra vez en modo Live (los de test no sirven).
   - Crear un webhook nuevo en modo Live con su propio `whsec_...`.
   - Sustituir en Vercel todas las claves de test por las de live (`sk_live_...`, nuevos `price_...`, nuevo `whsec_...`).
   - Hacer una compra real de importe bajo para confirmar que todo funciona con dinero de verdad antes de anunciarlo públicamente.

Guía detallada paso a paso de cada punto de configuración manual (Stripe, R2, Gmail, Vercel): ver [SETUP-STRIPE.md](SETUP-STRIPE.md).
