# Pasos manuales de configuración (Stripe + R2 + Gmail + Vercel)

Esta guía cubre todo lo que **tú tienes que hacer fuera del código** para que el cobro y el envío automático de archivos funcionen. El código ya está listo y espera estas variables de entorno (ver `.env.example`).

Hazlo en este orden: primero todo en modo **test/sandbox**, prueba una compra completa, y solo al final pasas a modo real.

---

## 1. Crear cuenta de Stripe

1. Ve a [stripe.com](https://stripe.com) → **Start now** / **Registrarse** → crea la cuenta con tu email.
2. No hace falta rellenar todos los datos de la empresa todavía para probar en modo test. Puedes completar el "activate account" (datos fiscales, cuenta bancaria) más adelante, antes de cobrar dinero real.
3. Arriba a la derecha del dashboard hay un interruptor **"Test mode" / "Modo de prueba"**. Déjalo activado mientras probamos.

### Obtener la clave secreta
1. Dashboard → **Desarrolladores** (Developers) → **Claves de API** (API keys).
2. Copia la **Clave secreta** (empieza por `sk_test_...`). Es la que usará el servidor — nunca la pongas en código del frontend ni la subas a git.
3. Guárdala para el paso de variables de entorno como `STRIPE_SECRET_KEY`.

---

## 2. Crear los 3 productos/precios

Repite esto 3 veces (uno por cada fila):

| Producto | Precio | Tipo |
|---|---|---|
| Plantilla Golden Revenue | 29,95 € | Pago único |
| Extra: +180 archivos .liquid | 9,99 € | Pago único |
| Extra: Ebook premium | 14,99 € | Pago único |

Pasos para cada uno:
1. Dashboard → **Catálogo de productos** (Product catalog) → **+ Añadir producto**.
2. Nombre: el de la tabla (p. ej. "Plantilla Golden Revenue"). Descripción opcional.
3. En "Precio": introduce el importe, y asegúrate de que está marcado como **pago único** (One-time), no recurrente/suscripción.
4. Guarda. Entra al producto creado y copia el **ID del precio**, que empieza por `price_...` (NO es el ID del producto, que empieza por `prod_...`).
5. Anota cuál `price_...` corresponde a cuál producto — los necesitarás así:
   - Plantilla → `STRIPE_PRICE_BASE`
   - Extra .liquid → `STRIPE_PRICE_LIQUIDS`
   - Ebook → `STRIPE_PRICE_EBOOK`

---

## 3. Crear el webhook

El webhook es lo que avisa a nuestro servidor de que un pago se ha completado. **Este paso hay que repetirlo cuando despliegues en Vercel**, porque necesita saber la URL final.

1. Dashboard → **Desarrolladores** → **Webhooks** → **+ Añadir endpoint**.
2. URL del endpoint: `https://TU-DOMINIO-EN-VERCEL/api/stripe-webhook`
   (si aún no tienes dominio, despliega primero el proyecto en Vercel —aunque falten las variables de entorno, igualmente obtienes una URL tipo `algo.vercel.app`— y vuelve a este paso).
3. Eventos a escuchar: busca y marca **`checkout.session.completed`**. Solo ese.
4. Guarda. Entra al webhook creado → **Signing secret** / **Secreto de firma** → copia el valor, empieza por `whsec_...`.
5. Ese valor va en `STRIPE_WEBHOOK_SECRET`.

> Nota: si en el futuro cambias de dominio o añades uno nuevo, tendrás que crear el webhook otra vez apuntando a la nueva URL.

---

## 4. Cloudflare R2 (donde viven los PDFs/vídeos/zips)

### Crear el bucket
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) → crea cuenta gratuita si no tienes.
2. Menú lateral → **R2 Object Storage** → **Crear bucket**.
3. Nombre del bucket, por ejemplo `golden-revenue-archivos`. Región automática. Crear.
4. Deja el bucket **privado** (por defecto lo es) — no actives acceso público. La seguridad depende de que NO sea público.

### Subir los archivos
Sube tus 3 archivos reales al bucket con **estos nombres exactos** (el código los busca por nombre):
- `plantilla-golden-revenue.zip`
- `extra-liquids.zip`
- `ebook-premium.pdf`

(Si prefieres otros nombres, dímelo y te actualizo el código en `api/stripe-webhook.js` para que coincidan.)

### Crear las credenciales de API
1. Dentro de R2 → **Administrar tokens de API de R2** (Manage R2 API Tokens) → **Crear token de API**.
2. Permisos: **Lectura y escritura de objetos** (Object Read & Write), y limita el token a tu bucket concreto si te lo permite.
3. Al crear el token te da 3 valores, guárdalos porque el "Secret" solo se muestra una vez:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`
4. También necesitas tu **Account ID** de Cloudflare (aparece en la barra lateral derecha del dashboard, o en la URL) → `R2_ACCOUNT_ID`.
5. El nombre del bucket que elegiste → `R2_BUCKET_NAME`.

---

## 5. Contraseña de aplicación de Gmail

Necesitas una cuenta de Gmail desde la que se enviarán los correos con los links de descarga.

1. Entra en esa cuenta de Google → [myaccount.google.com/security](https://myaccount.google.com/security).
2. Activa la **verificación en 2 pasos** si no la tienes activada (es obligatoria para poder crear contraseñas de aplicación).
3. Busca **"Contraseñas de aplicaciones"** (App passwords) — normalmente dentro de "Verificación en 2 pasos" o buscándolo directamente en el buscador de ajustes de la cuenta de Google.
4. Crea una nueva, ponle un nombre como "Golden Revenue Web", y copia la contraseña de 16 caracteres que te da (sin espacios).
5. Esa cuenta va en `EMAIL_USER` (el email completo) y la contraseña en `EMAIL_APP_PASSWORD`.

---

## 6. Configurar las variables de entorno en Vercel

1. En el dashboard de Vercel, entra al proyecto → **Settings** → **Environment Variables**.
2. Añade una por una todas las de `.env.example`, con los valores reales que has ido copiando:

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_BASE
STRIPE_PRICE_LIQUIDS
STRIPE_PRICE_EBOOK
SITE_URL              → https://tu-dominio-en-vercel.app (sin barra final)
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
EMAIL_USER
EMAIL_APP_PASSWORD
```

3. Marca que apliquen a **Production** (y opcionalmente a Preview/Development si quieres probar en despliegues de prueba).
4. Después de añadirlas, haz un **redeploy** del proyecto para que las funciones las recojan (los cambios de variables de entorno no afectan a despliegues ya hechos).

### Para probar en tu propio ordenador (opcional, antes de desplegar)
1. Copia `.env.example` a un archivo nuevo llamado `.env` en la raíz del proyecto, y rellénalo con los mismos valores (con las claves de **test** de Stripe).
2. Instala la CLI de Vercel si no la tienes: `npm i -g vercel`.
3. Ejecuta `vercel dev` en vez de `npm run dev` — así las funciones de `/api` también corren en local.
4. Instala la CLI de Stripe ([stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)) y ejecuta:
   ```
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
   Esto te da un `whsec_...` temporal para local — úsalo en tu `.env` local en vez del de producción.

---

## 7. Probar de verdad antes de cobrar dinero real

1. Con todo en modo **test**, ve a la web, marca o no los extras, y pulsa "Comprar ahora".
2. En el formulario de pago de Stripe, usa la tarjeta de pruebas: `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC.
3. Comprueba:
   - Te redirige a `/gracias.html` y muestra "Pago confirmado".
   - Te llega el email (revisa spam) con los links correctos según lo que hayas comprado.
   - Los links de descarga funcionan.
4. Repite probando con distintas combinaciones de extras para asegurarte de que cada compra manda solo los archivos correspondientes.

---

## 8. Pasar a modo real (cobrar de verdad)

Solo cuando todo lo anterior funcione:

1. En Stripe, completa la activación de la cuenta (datos fiscales/bancarios) si no lo has hecho.
2. Cambia el interruptor de **Test mode** a **Live mode** en el dashboard.
3. Repite los pasos 1-3 de esta guía **en modo live**: nuevas claves (`sk_live_...`), nuevos productos/precios (los de test no sirven en live), nuevo webhook con su propio `whsec_...`.
4. Sustituye esas variables en Vercel por las de live y haz redeploy.
5. Haz una compra real de importe bajo tú mismo para confirmar que todo el circuito funciona con dinero de verdad antes de anunciarlo públicamente.
