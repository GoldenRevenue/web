import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Calendar, Users, User, Check } from 'lucide-react'

function AudienceVisual() {
  const orbit = [
    { Icon: Heart, style: { top: '10%', left: '50%', transform: 'translate(-50%,0)' } },
    { Icon: ShoppingCart, style: { top: '50%', left: '8%', transform: 'translate(0,-50%)' } },
    { Icon: Calendar, style: { top: '50%', right: '8%', transform: 'translate(0,-50%)' } },
    { Icon: Users, style: { bottom: '10%', left: '32%' } },
  ]
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full">
        <g stroke="rgba(255,255,255,0.14)" strokeWidth="1">
          <line x1="50%" y1="50%" x2="50%" y2="18%" />
          <line x1="50%" y1="50%" x2="18%" y2="50%" />
          <line x1="50%" y1="50%" x2="82%" y2="50%" />
          <line x1="50%" y1="50%" x2="38%" y2="80%" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-light/50 bg-black">
        <User size={18} className="text-brand-light" />
      </div>
      {orbit.map(({ Icon, style }, i) => (
        <div
          key={i}
          style={style}
          className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-line bg-elevated2 text-muted transition-colors duration-300 group-hover:text-brand-light"
        >
          <Icon size={14} />
        </div>
      ))}
    </div>
  )
}

function StructureVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-5">
      <p className="mb-1 text-[11px] font-medium text-muted">Categorías</p>
      {['Category List', 'Banner', 'Product Carousel'].map((label) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-md border border-line bg-black/40 px-3 py-2"
        >
          <span className="text-[11px] text-muted">{label}</span>
          <span className="h-1.5 w-4 rounded-full bg-white/15" />
        </div>
      ))}
    </div>
  )
}

function ConversionVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-6 p-5">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg viewBox="0 0 64 64" className="absolute h-full w-full -rotate-90">
          <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="#A8E063"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 27}
            strokeDashoffset={2 * Math.PI * 27 * 0.14}
          />
        </svg>
        <span className="text-[13px] font-bold text-ink">86%</span>
      </div>
      <div className="space-y-2">
        {['UX', 'Velocidad', 'Conversión'].map((label) => (
          <div key={label} className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand/25">
              <Check size={10} className="text-brand-light" />
            </span>
            <span className="text-[11px] text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const BLOCKS = [
  {
    title: 'Diseño pensado para tu cliente real',
    text: 'Analizamos tu marca, tu cliente ideal y tu propuesta antes de diseñar. Cada decisión parte de una estrategia.',
    Visual: AudienceVisual,
  },
  {
    title: 'Estructura con criterio',
    text: 'Cada sección, cada botón y cada elemento tiene una función: guiar al usuario y eliminar fricción.',
    Visual: StructureVisual,
  },
  {
    title: 'Una experiencia que convierte',
    text: 'Combinamos diseño, UX y estrategia de conversión para que tu tienda no solo se vea bien, sino que funcione.',
    Visual: ConversionVisual,
  },
]

export default function Solutions() {
  return (
    <section id="soluciones" className="section-pad relative">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[680px] text-center"
        >
          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
            Así construimos una marca que se ve como lo que es.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] text-muted">
            No empezamos por una plantilla. Empezamos por entender tu negocio.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col gap-5">
          {BLOCKS.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card-surface card-surface-hover group flex flex-col items-center gap-8 rounded-xl3 p-6 sm:p-8 md:flex-row"
            >
              <div className="h-[160px] w-full flex-none overflow-hidden rounded-xl2 border border-white/[0.06] bg-black/30 md:h-[150px] md:w-[220px]">
                <block.Visual />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-[19px] font-semibold text-ink">{block.title}</h3>
                <p className="mt-2.5 max-w-[460px] text-[14px] leading-relaxed text-muted">{block.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
