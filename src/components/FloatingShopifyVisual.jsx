import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { ShoppingBag, Bell } from 'lucide-react'

// Puntos de control de las curvas (viewBox 1000 x 380), convergiendo en el nodo central (500,190)
const LINES = [
  { d: 'M 30 40 Q 260 40 500 190', delay: 0 },
  { d: 'M 30 130 Q 260 150 500 190', delay: 0.12 },
  { d: 'M 30 230 Q 260 210 500 190', delay: 0.24 },
  { d: 'M 30 320 Q 260 280 500 190', delay: 0.36 },
  { d: 'M 970 30 Q 740 60 500 190', delay: 0.08 },
  { d: 'M 970 150 Q 740 160 500 190', delay: 0.2 },
  { d: 'M 970 260 Q 740 230 500 190', delay: 0.32 },
  { d: 'M 970 340 Q 740 290 500 190', delay: 0.44 },
]

// Puntos muestreados a lo largo de una curva cuadrática, usados para animar las partículas
function sampleQuad(p0, p1, p2, steps = 6) {
  const pts = { x: [], y: [] }
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
    pts.x.push(x)
    pts.y.push(y)
  }
  return pts
}

const PARTICLE_PATHS = [
  sampleQuad([30, 40], [260, 40], [500, 190]),
  sampleQuad([30, 230], [260, 210], [500, 190]),
  sampleQuad([970, 30], [740, 60], [500, 190]),
  sampleQuad([970, 260], [740, 230], [500, 190]),
]

export default function FloatingShopifyVisual() {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const rotX = useTransform(sy, [-40, 40], [3, -3])
  const rotY = useTransform(sx, [-40, 40], [-3, 3])
  const shiftX = useTransform(sx, [-40, 40], [-8, 8])
  const shiftY = useTransform(sy, [-40, 40], [-6, 6])

  function handleMouseMove(e) {
    if (reduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 80)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 80)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto mt-4 h-[300px] w-full max-w-[1000px] sm:h-[360px] md:h-[400px]"
      aria-hidden="true"
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="absolute inset-0 [perspective:1000px]">
        <svg
          viewBox="0 0 1000 380"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.16)" />
              <stop offset="100%" stopColor="rgba(168,224,99,0.55)" />
            </linearGradient>
          </defs>
          {LINES.map((line, i) => (
            <motion.path
              key={i}
              d={line.d}
              fill="none"
              stroke="url(#lineFade)"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.6 + line.delay, ease: 'easeOut' }}
            />
          ))}

          {!reduceMotion &&
            PARTICLE_PATHS.map((pts, i) => (
              <motion.circle
                key={i}
                r={2.6}
                fill="#A8E063"
                initial={{ opacity: 0 }}
                animate={{ cx: pts.x, cy: pts.y, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.2,
                  delay: 2 + i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: 'easeInOut',
                }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(168,224,99,0.9))' }}
              />
            ))}
        </svg>

        {/* Nodo central Shopify */}
        <motion.div
          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2"
          style={{ x: shiftX, y: shiftY }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            animate={reduceMotion ? {} : { scale: [1, 1.045, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #A8E063, #6FAF32 70%)',
              boxShadow: '0 0 50px 6px rgba(149,191,71,0.45), 0 0 90px 20px rgba(149,191,71,0.15)',
            }}
          >
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <ShoppingBag className="h-8 w-8 text-black/80 sm:h-9 sm:w-9" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Tarjeta flotante: notificación de pedido */}
        <motion.div
          style={{ x: useTransform(shiftX, (v) => v * 0.6), y: useTransform(shiftY, (v) => v * 0.6) }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="absolute left-[58%] top-[62%] hidden w-[220px] sm:block"
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-start gap-3 rounded-2xl border border-line bg-elevated/90 px-4 py-3 shadow-card backdrop-blur"
          >
            <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand/20">
              <Bell size={13} className="text-brand-light" />
            </span>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-ink">Nuevo pedido recibido</p>
              <p className="text-[11px] leading-snug text-muted">2 artículos · 79,00&nbsp;€</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Chip flotante secundario */}
        <motion.div
          style={{ x: useTransform(shiftX, (v) => v * -0.5), y: useTransform(shiftY, (v) => v * -0.4) }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="absolute left-[16%] top-[68%] hidden sm:block"
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, 7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="flex items-center gap-2 rounded-full border border-line bg-elevated/90 px-3.5 py-2 shadow-card backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
            <span className="text-[11px] font-medium text-muted">Conversión +38%</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
