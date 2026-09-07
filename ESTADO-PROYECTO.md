# Estado del proyecto — Cobro con Stripe (Golden Revenue)

Última revisión: 2026-09-07. **El flujo completo de pago funciona de extremo a extremo** (pago de test → email con los 4 enlaces de descarga recibido correctamente).

## Auditoría de seguridad (código activo en producción)

Revisado línea por línea `api/create-checkout-session.js`, `api/stripe-webhook.js`, `vercel.json`, `.gitignore` e historial completo de git.

**Correcto / sin hallazgos:**
- El webhook verifica la firma de Stripe (`stripe.webhooks.constructEvent`) antes de hacer nada — sin la clave `STRIPE_WEBHOOK_SECRET` (que solo vive en variables de entorno de Vercel) nadie puede simular un pago falso.
- Ningún dato que decide qué se entrega (producto comprado, email del comprador) viene del navegador — todo se lee de la sesión de Stripe ya verificada.
- Los enlaces de descarga son URLs firmadas de R2 con caducidad de 72h, generadas en el momento por el webhook — no hay URLs públicas permanentes en el código.
- `gracias.html` no expone ni sirve ningún archivo, solo un mensaje — nada que un atacante pueda "encontrar" ahí.
- `.gitignore` excluye `.env*` correctamente. Revisado **todo el historial de git**: nunca se ha commiteado ningún archivo `.env` real ni ningún secreto — solo `.env.example`, con placeholders.
- Cabeceras de seguridad en `vercel.json` (CSP, HSTS, X-Frame-Options, nosniff, Permissions-Policy) presentes y coherentes con que no cargamos Stripe.js en el cliente.
- Los endpoints (`create-checkout-session`, `stripe-webhook`) solo aceptan `POST`, rechazan cualquier otro método.
- **Bucket de Cloudflare R2 (`ecom`): confirmado privado.** "Public Access"/r2.dev subdomain desactivado y sin dominio personalizado conectado — no existe ninguna URL pública a los archivos. Los enlaces que recibe el cliente son siempre firmados y temporales (72h).

**Notas pendientes (no bloquean el uso actual, pero conviene resolver antes de ir a producción real):**
- El token de API de R2 que se pegó en el chat durante la configuración quedó registrado en texto plano en esta conversación. Antes de pasar a modo Live, revócalo en Cloudflare y genera uno nuevo.
- Queda un webhook "huérfano" creado por error en una cuenta de Stripe equivocada (`acct_1UAsuVDbDuKkJY27`, nunca recibió eventos). No supone un riesgo, pero conviene borrarlo para no confundirse en el futuro. El webhook correcto y activo vive en `acct_1UAsueRfIkmXoMK9` (la cuenta de tu `STRIPE_SECRET_KEY`).
- Hay un archivo `Textos golden revenue.pdf` en la carpeta de entregables que no está asignado a ningún producto (no apareció en el mapeo de la captura original). Confirmar si debe entregarse en algún caso o es solo material de referencia.

---

## ✅ Qué está hecho

- **Frontend**: botón "Comprar ahora" en `Pricing.jsx` conectado a Stripe Checkout (crea sesión con la plantilla base + extras marcados).
- **`api/create-checkout-session.js`**: crea la sesión de pago. Se corrigió el error de "Managed Payments" (impuestos automáticos, activado por defecto en cuentas nuevas de Stripe) desactivándolo explícitamente — sin esto, todos los pagos fallaban con error 500.
- **`api/stripe-webhook.js`**:
  - Verifica el pago, identifica qué se compró y envía el email con los enlaces.
  - La lectura del "raw body" (necesaria para verificar la firma) se hace con `micro`'s `buffer()`, el método oficial recomendado por Stripe para Vercel — la lectura manual del stream que se usó al principio no era fiable en este entorno.
  - Cada producto puede entregar **varios archivos** (la plantilla entrega el `.zip` + la guía en PDF a la vez).
  - Deliverables reales configurados:
    - Plantilla → `Plantilla Golden Revenue.zip` + `Guia Golden Revenue.pdf`
    - Extra liquids → `golden-revenue2ç.rar`
    - Extra ebook → `Golden_Revenue_eBook_Premium.pdf`
  - Si se compran varios productos en una sola compra, el email ya incluye automáticamente todos los archivos correspondientes (no hace falta un caso especial para "todo junto").
- **`gracias.html`**: página de confirmación propia, sin exponer nada sensible.
- **Stripe (sandbox/test, cuenta `acct_1UAsueRfIkmXoMK9`)**:
  - 3 productos/precios creados: Plantilla (`STRIPE_PRICE_BASE`), +180 liquids (`STRIPE_PRICE_LIQUIDS`), Ebook (`STRIPE_PRICE_EBOOK`).
  - Webhook activo (`pago`) apuntando a `https://www.ecomgoldenrevenue.com/api/stripe-webhook`, escuchando `checkout.session.completed`.
- **Cloudflare R2**: bucket `ecom` privado, credenciales de API generadas, archivos reales subidos y mapeados.
- **Gmail**: contraseña de aplicación generada y configurada — el envío de emails funciona.
- **Vercel**: todas las variables de entorno configuradas en Production (Stripe, R2, Gmail, `SITE_URL` apuntando al dominio real `www.ecomgoldenrevenue.com`); proyecto conectado a GitHub (`GoldenRevenue/web`, rama `main`) con despliegue automático en cada push.
- **Verificado end-to-end**: compra de test completa → redirección a "Pago confirmado" → email recibido con los enlaces de descarga correctos.

## 🔲 Qué falta por hacer

1. **Confirmar que los 4 enlaces del último email descargan el archivo correcto** cada uno (comprobación rápida, ya deberían funcionar).
2. **Borrar el webhook huérfano** de la cuenta equivocada (`acct_1UAsuVDbDuKkJY27`).
3. **Revocar y regenerar el token de API de R2** que quedó pegado en el chat, antes de ir a producción real.
4. **Decidir qué hacer con `Textos golden revenue.pdf`** (¿se entrega en algún producto o no?).
5. **Pasar a modo Live cuando todo lo anterior esté validado**:
   - Activar la cuenta de Stripe (datos fiscales/bancarios).
   - Crear los 3 productos otra vez en modo Live (los de test no sirven).
   - Crear un webhook nuevo en modo Live, en la cuenta Live correcta, con su propio `whsec_...`.
   - Sustituir en Vercel todas las claves de test por las de live (`sk_live_...`, nuevos `price_...`, nuevo `whsec_...`).
   - Hacer una compra real de importe bajo para confirmar que todo funciona con dinero de verdad antes de anunciarlo públicamente.

Guía detallada paso a paso de cada punto de configuración manual (Stripe, R2, Gmail, Vercel): ver [SETUP-STRIPE.md](SETUP-STRIPE.md).
