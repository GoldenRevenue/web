import { motion, useScroll, useSpring } from 'framer-motion'

const PROGRESS_SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 }

/** Línea de progreso de lectura bajo el navbar: el scroll siempre tiene respuesta visual. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, PROGRESS_SPRING)

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand-light to-brand"
    />
  )
}
