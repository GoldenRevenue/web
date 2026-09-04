import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE_BRAND } from '../constants/animation'

// Por debajo de este ancho, el carrusel deja de desplazar el texto a los lados:
// en pantallas estrechas ese barrido horizontal saca la lectura del centro y
// resulta incómodo. La profundidad (escala/blur/opacidad) se mantiene igual.
const MOBILE_BREAKPOINT_PX = 640

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

const ITEMS = [
  {
    title: 'Una plantilla genérica',
    text: 'Tu tienda se parece a cientos de negocios más. No transmite una identidad propia ni genera recuerdo.',
  },
  {
    title: 'Cambios sin criterio',
    text: 'Colores, textos y secciones modificados sin una estrategia clara. Cada elemento debería tener una razón.',
  },
  {
    title: 'No transmite lo que vendes',
    text: 'Tu producto puede ser excelente, pero si tu tienda no lo comunica correctamente, el cliente no lo percibe.',
  },
]

const TOTAL = ITEMS.length

// Distancia circular más corta entre un índice y la posición continua activa
// (puede ser fraccionaria mientras el scroll está a mitad de una transición).
function circularDelta(index, activeContinuous) {
  let diff = index - activeContinuous
  diff = ((diff + TOTAL / 2) % TOTAL + TOTAL) % TOTAL - TOTAL / 2
  return diff
}

function ProblemSlide({ item, index, active, isMobile }) {
  // Todo se deriva de "active" (0 → TOTAL-1, continuo) — nada de estado propio,
  // el scroll es la única fuente de verdad, igual que en el resto del sitio.
  // En móvil el desplazamiento lateral y el giro se anulan (multiplicador 0):
  // el texto permanece siempre centrado, solo cambia de profundidad.
  const x = useTransform(active, (v) => `${circularDelta(index, v) * (isMobile ? 0 : 92)}%`)
  const rotateY = useTransform(active, (v) => circularDelta(index, v) * (isMobile ? 0 : -38))
  const z = useTransform(active, (v) => -180 * Math.min(Math.abs(circularDelta(index, v)), 1))
  const scale = useTransform(active, (v) => 1 - 0.2 * Math.min(Math.abs(circularDelta(index, v)), 1))
  // Sin desplazamiento lateral en móvil, los textos comparten el mismo centro:
  // hay que ocultarlos mucho más rápido (factor 3.4 en vez de 0.77) para que
  // nunca queden dos títulos legibles superpuestos durante la transición.
  const opacity = useTransform(active, (v) =>
    Math.max(0, 1 - Math.abs(circularDelta(index, v)) * (isMobile ? 3.4 : 0.77))
  )
  const blur = useTransform(active, (v) => `blur(${Math.min(Math.abs(circularDelta(index, v)) * 1.8, 2)}px)`)
  const textOpacity = useTransform(active, (v) => Math.max(0, 1 - Math.abs(circularDelta(index, v)) * 5))
  // El más cercano al centro pinta por encima de los demás, para que un resto
  // de opacidad residual nunca "gane" visualmente al título que sí se está leyendo.
  const zIndex = useTransform(active, (v) => Math.round(100 - Math.abs(circularDelta(index, v)) * 10))

  return (
    <motion.div
      style={{ x, rotateY, z, scale, opacity, filter: blur, zIndex, transformStyle: 'preserve-3d' }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-16"
    >
      <h3 className="text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[32px]">
        {item.title}
      </h3>
      <motion.p
        style={{ opacity: textOpacity }}
        className="mx-auto mt-4 max-w-[320px] text-[14px] leading-relaxed text-muted sm:max-w-[420px] sm:text-[15px]"
      >
        {item.text}
      </motion.p>
    </motion.div>
  )
}

function ProblemsCarousel({ progress }) {
  // El scroll de la sección (0 → 1) recorre linealmente el primer al último
  // problema: empieza en el índice 0 y termina exactamente en el último, sin dar la vuelta.
  const active = useTransform(progress, [0, 1], [0, TOTAL - 1])
  const isMobile = useIsMobile()

  return (
    <div className="relative h-[260px] sm:h-[240px]" style={{ perspective: 1200 }}>
      {ITEMS.map((item, i) => (
        <ProblemSlide key={item.title} item={item} index={i} active={active} isMobile={isMobile} />
      ))}
    </div>
  )
}

export default function Problems() {
  const sectionRef = useRef(null)
  // Pin de la sección: mientras dura el scroll dentro de ella, el carrusel
  // gira en 3D acompañando el gesto del usuario en vez de animarse solo.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="problemas" ref={sectionRef} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 flex min-h-screen flex-col justify-center section-pad">
        <div className="container-px mx-auto max-w-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE_BRAND }}
            className="mx-auto max-w-[680px] text-center"
          >
            <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
              ¿Por qué tu tienda no parece una marca profesional?
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-[15px] text-muted">
              Porque tener una tienda online no significa tener una marca.
            </p>
          </motion.div>

          <div className="mt-10">
            <ProblemsCarousel progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}
