import { motion } from 'framer-motion'
import { EASE_BRAND, fadeInUp } from '../constants/animation'
import { useMouseTilt } from '../hooks/useMouseTilt'
import audienceImg from './img/1.jpeg'
import structureImg from './img/2.jpeg'

const BLOCKS = [
  {
    title: 'Diseño pensado para tu cliente real',
    text: 'Analizamos tu marca, tu cliente ideal y tu propuesta antes de diseñar. Cada decisión parte de una estrategia.',
    image: audienceImg,
  },
  {
    title: 'Estructura con criterio',
    text: 'Cada sección, cada botón y cada elemento tiene una función: guiar al usuario y eliminar fricción.',
    image: structureImg,
  },
]

function SolutionBlock({ block, index }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt()

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...fadeInUp.visible.transition, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="card-surface card-surface-hover group flex flex-col items-center gap-8 rounded-xl3 p-6 sm:p-8 md:flex-row"
    >
      <div
        style={{ transform: 'translateZ(20px)' }}
        className="h-[160px] w-full flex-none overflow-hidden rounded-xl2 border border-white/[0.06] bg-black/30 md:h-[150px] md:w-[220px]"
      >
        <img src={block.image} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div style={{ transform: 'translateZ(16px)' }} className="text-center md:text-left">
        <h3 className="text-[19px] font-semibold text-ink">{block.title}</h3>
        <p className="mt-2.5 max-w-[460px] text-[14px] leading-relaxed text-muted">{block.text}</p>
      </div>
    </motion.div>
  )
}

export default function Solutions() {
  return (
    <section id="soluciones" className="section-pad relative">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
          className="mx-auto max-w-[680px] text-center"
        >
          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
            Así construimos una marca que se ve como lo que es.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] text-muted">
            No empezamos por una plantilla. Empezamos por entender tu negocio.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col gap-5" style={{ perspective: 1400 }}>
          {BLOCKS.map((block, i) => (
            <SolutionBlock key={block.title} block={block} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
