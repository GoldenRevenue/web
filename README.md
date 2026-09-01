# Golden Revenue — Landing page

Landing page premium para una agencia especializada en Shopify. React + Vite + Tailwind CSS + Framer Motion + Lucide React.

## Cómo ejecutarla

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (por defecto `http://localhost:5173`).

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  config.js                 -> nombre de marca, enlaces de navegación, texto del CTA
  index.css                 -> tokens globales, fondo ambiental, botones, tarjetas
  App.jsx                   -> ensambla todas las secciones
  components/
    Navbar.jsx
    Hero.jsx
    FloatingShopifyVisual.jsx
    Portfolio.jsx
    Problems.jsx
    Solutions.jsx
    Methodology.jsx
    FAQ.jsx
    CTA.jsx
    Footer.jsx
    FloatingBottomNavigation.jsx
    ui/StoreMockup.jsx
```

## Personalización rápida

- **Nombre de marca:** cambia `BRAND_NAME` en `src/config.js` (se actualiza en navbar, footer y pie de página).
- **Colores:** están definidos en `tailwind.config.js` (`brand`, `surface`, `elevated`, `line`, `muted`...), siguiendo la paleta negro + verde Shopify solicitada.
- **Copys:** cada sección tiene su texto directamente en el componente correspondiente.
- **Proyectos del portfolio:** array `PROJECTS` en `Portfolio.jsx`. Los mockups son 100% CSS (`ui/StoreMockup.jsx`); puedes sustituirlos por capturas reales de tiendas cuando las tengas.

## Notas de diseño

- Toda la web respeta `prefers-reduced-motion`: si el usuario lo tiene activado, se desactivan las animaciones continuas (parallax, partículas, pulsos).
- El foco de teclado es visible (`:focus-visible`) para accesibilidad.
- No hay overflow horizontal: todas las secciones usan `container-px` / `max-w-content` y las animaciones solo mueven `transform`/`opacity`.
