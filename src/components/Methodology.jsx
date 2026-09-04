import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Check } from 'lucide-react'
import { EASE_BRAND } from '../constants/animation'

function TagsVisual() {
  const tags = ['Shopify', 'Google Analytics', 'Google', 'Reddit', 'Amazon']
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {tags.map((t, i) => (
        <span
          key={t}
          className={`rounded-full border px-2.5 py-1 text-[10px] ${
            i === 0
              ? 'border-brand/40 bg-brand/15 text-brand-light'
              : 'border-line bg-black/40 text-muted'
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function PaletteVisual() {
  return (
    <div className="space-y-2 p-4">
      <div className="flex gap-1.5">
        {['#A8E063', '#151515', '#E8D9BE', '#C4693B'].map((c) => (
          <span key={c} className="h-5 w-5 rounded-md border border-white/10" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="flex gap-1.5">
        {['Aa', 'Aa', 'Aa'].map((t, i) => (
          <span
            key={i}
            className="flex h-6 w-8 items-center justify-center rounded-md border border-line bg-black/40 text-[10px] font-semibold text-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function ListVisual() {
  return (
    <div className="space-y-1.5 p-4">
      {['Category List', 'Banner', 'Product Carousel'].map((l) => (
        <div key={l} className="flex items-center justify-between rounded-md border border-line bg-black/40 px-2.5 py-1.5">
          <span className="text-[10px] text-muted">{l}</span>
          <span className="h-3 w-3 rounded-sm bg-white/10" />
        </div>
      ))}
    </div>
  )
}

function ScoreVisual() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg viewBox="0 0 48 48" className="absolute h-full w-full -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#A8E063"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * 0.08}
          />
        </svg>
        <span className="text-[10px] font-bold text-ink">92</span>
      </div>
      <div className="space-y-1">
        {['Responsive', 'Velocidad'].map((l) => (
          <div key={l} className="flex items-center gap-1.5">
            <Check size={10} className="text-brand-light" />
            <span className="text-[10px] text-muted">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const STAGES = [
  {
    n: '01',
    tag: 'Compra',
    title: 'Consigue la plantilla al instante',
    text: 'Pago único, sin mensualidades. En cuanto completas la compra recibes acceso inmediato a los archivos y a la guía de instalación.',
    Visual: TagsVisual,
  },
  {
    n: '02',
    tag: 'Personaliza',
    title: 'Hazla tuya sin tocar código',
    text: 'Cambia colores, tipografías, banners y secciones desde el propio editor de temas de Shopify. Todo pensado para adaptarse a tu marca.',
    Visual: PaletteVisual,
  },
  {
    n: '03',
    tag: 'Publica',
    title: 'Actívala y empieza a vender',
    text: 'Sustituye tu tema actual sin perder productos, clientes ni pedidos. La tienda queda lista para publicarse en minutos.',
    Visual: ListVisual,
  },
  {
    n: '04',
    tag: 'Soporte',
    title: 'Todo revisado de antemano',
    text: 'Responsive, velocidad y microinteracciones ya optimizados de fábrica. Si algo falla durante la instalación, tienes soporte por email.',
    Visual: ScoreVisual,
  },
]

function Stage({ stage, index }) {
  const isEven = index % 2 === 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-[28px_1fr] items-start gap-5 md:grid-cols-[1fr_28px_1fr] md:gap-8"
    >
      <div className="relative z-10 flex justify-center pt-1 md:col-start-2">
        <motion.span
          initial={{ scale: 0.5, backgroundColor: '#1a1a1a' }}
          whileInView={{ scale: 1, backgroundColor: '#A8E063' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="h-3 w-3 rounded-full ring-4 ring-black"
        />
      </div>

      <div
        className={`flex flex-col ${
          isEven ? 'md:col-start-1 md:items-end md:text-right' : 'md:col-start-3 md:items-start md:text-left'
        }`}
      >
        <span className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-light">
          {stage.n} — {stage.tag}
        </span>
        <h3 className="text-[19px] font-semibold text-ink sm:text-[21px]">{stage.title}</h3>
        <p className="mt-2 max-w-[380px] text-[14px] leading-relaxed text-muted">{stage.text}</p>
        <div className="mt-4 w-full max-w-[280px] overflow-hidden rounded-xl2 border border-line bg-elevated">
          <stage.Visual />
        </div>
      </div>

      <div className={`hidden md:block ${isEven ? 'md:col-start-3' : 'md:col-start-1'}`} />
    </motion.div>
  )
}

export default function Methodology() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  })

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
          className="mx-auto max-w-[640px] text-center"
        >
          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
            Así funciona
          </h2>
          <p className="mx-auto mt-4 max-w-[460px] text-[15px] text-muted">
            Sin llamadas ni procesos largos: de la compra a tu tienda publicada en minutos.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative mt-16">
          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="absolute bottom-2 left-[13px] top-2 w-px bg-gradient-to-b from-brand-light to-brand md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-16 md:gap-14">
            {STAGES.map((stage, i) => (
              <Stage key={stage.n} stage={stage} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
