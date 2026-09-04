// Curva de marca: toda animación de Golden Revenue comparte este easing (salida expo suave).
// Ya era el valor dominante en el proyecto (Portfolio, Solutions, CTA, Pricing); se centraliza aquí
// para que ningún componente nuevo introduzca un easing distinto y rompa la coherencia percibida.
export const EASE_BRAND = [0.16, 1, 0.3, 1]

export const DURATION_ENTER_S = 0.65
export const STAGGER_CHILDREN_S = 0.12

// Perspectiva común para los efectos 3D ligados al scroll (px)
export const PERSPECTIVE_PX = 1200

// Entrada estándar: fundido + desplazamiento vertical + desenfoque suave.
// Sin rotateX: se usa en tarjetas que ya tienen su propio tilt 3D por cursor
// (useMouseTilt controla rotateX/rotateY), para no pelear por la misma propiedad.
export const fadeInUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION_ENTER_S, ease: EASE_BRAND },
  },
}

// Entrada 3D "premium": el elemento se levanta desde el plano del suelo hacia el espectador,
// como si tuviera peso físico. Se usa en tarjetas y bloques destacados.
export const riseIn3D = {
  hidden: { opacity: 0, y: 46, rotateX: -10, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_BRAND },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_CHILDREN_S, delayChildren: 0.08 },
  },
}
