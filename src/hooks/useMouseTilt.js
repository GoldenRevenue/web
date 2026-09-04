import { useRef, useCallback } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const MAX_TILT_DEG = 5
const TILT_SPRING = { stiffness: 150, damping: 20 }

/**
 * Inclinación 3D de una tarjeta siguiendo el cursor, como una lámina flotando.
 * Respeta prefers-reduced-motion: el tilt queda desactivado y solo se anima
 * la entrada por scroll (que sí es 1:1 con la posición, no en bucle).
 */
export function useMouseTilt() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, TILT_SPRING)
  const rotateY = useSpring(rawY, TILT_SPRING)

  const handleMouseMove = useCallback(
    (event) => {
      if (reduceMotion || !ref.current) return
      const bounds = ref.current.getBoundingClientRect()
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5
      rawX.set(-relativeY * MAX_TILT_DEG * 2)
      rawY.set(relativeX * MAX_TILT_DEG * 2)
    },
    [rawX, rawY, reduceMotion]
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}
