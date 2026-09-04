import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE_BRAND, fadeInUp } from '../constants/animation'
import { useMouseTilt } from '../hooks/useMouseTilt'

function TemplateVisual() {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <p className="mb-2 text-[11px] font-medium text-muted">Categorías</p>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 rounded-md bg-white/[0.06]" />
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-muted/70">Our latest arrivals</p>
    </div>
  )
}

function CriteriaVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4">
      <div className="flex items-center justify-between rounded-full border border-line bg-black/40 px-3 py-1.5">
        <span className="text-[10px] font-medium text-muted">DATOS</span>
        <span className="relative h-4 w-8 rounded-full bg-white/10">
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white/60" />
        </span>
        <span className="text-[10px] font-medium text-muted">INTUICIÓN</span>
      </div>
      <div className="flex items-end gap-1.5 px-1">
        {[40, 65, 30, 80, 50].map((h, i) => (
          <div
            key={i}
            className="w-full rounded-sm bg-white/10"
            style={{ height: `${h * 0.4}px` }}
          />
        ))}
      </div>
    </div>
  )
}

function UnclearVisual() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <svg viewBox="0 0 120 120" className="h-24 w-24">
        <defs>
          <filter id="glow-warn">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g fill="none" stroke="#E8845A" strokeWidth="1.3" opacity="0.85" filter="url(#glow-warn)">
          <path d="M60 8 A52 52 0 0 1 100 90" />
          <path d="M100 90 A52 52 0 0 1 22 96" />
          <path d="M22 96 A52 52 0 0 1 18 40" />
          <path d="M18 40 A52 52 0 0 1 60 8" />
          <path d="M60 8 L58 62" />
          <path d="M100 90 L58 62" />
          <path d="M22 96 L58 62" />
          <path d="M18 40 L58 62" />
        </g>
      </svg>
    </div>
  )
}

const CARDS = [
  {
    title: 'Una plantilla genérica',
    text: 'Tu tienda se parece a cientos de negocios más. No transmite una identidad propia ni genera recuerdo.',
    Visual: TemplateVisual,
  },
  {
    title: 'Cambios sin criterio',
    text: 'Colores, textos y secciones modificados sin una estrategia clara. Cada elemento debería tener una razón.',
    Visual: CriteriaVisual,
  },
  {
    title: 'No transmite lo que vendes',
    text: 'Tu producto puede ser excelente, pero si tu tienda no lo comunica correctamente, el cliente no lo percibe.',
    Visual: UnclearVisual,
  },
]

function ProblemCard({ card, index }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt()

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...fadeInUp.visible.transition, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="card-surface card-surface-hover rounded-xl2 p-6"
    >
      <div
        style={{ transform: 'translateZ(24px)' }}
        className="mb-6 h-[140px] overflow-hidden rounded-xl border border-white/[0.06] bg-black/30"
      >
        <card.Visual />
      </div>
      <h3 style={{ transform: 'translateZ(16px)' }} className="text-[17px] font-semibold text-ink">
        {card.title}
      </h3>
      <p style={{ transform: 'translateZ(16px)' }} className="mt-2 text-[14px] leading-relaxed text-muted">
        {card.text}
      </p>
    </motion.div>
  )
}

export default function Problems() {
  return (
    <section id="problemas" className="section-pad relative">
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

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3" style={{ perspective: 1400 }}>
          {CARDS.map((card, i) => (
            <ProblemCard key={card.title} card={card} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_BRAND }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#soluciones"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="btn-primary px-6 py-3.5 text-[14px]"
          >
            Quiero solucionar estos problemas
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
