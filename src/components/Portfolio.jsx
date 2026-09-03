import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import papelTinta from './img/papel-tinta.jpeg'
import faunaCo from './img/fauna-co.jpeg'
import auroraHome from './img/aurora-home.jpeg'
import retroPlay from './img/retro-play.jpeg'

const PROJECTS = [
  { name: 'Papel & Tinta', tag: 'Librería · Papelería', image: papelTinta },
  { name: 'Fauna & Co.', tag: 'Mascotas · Accesorios', image: faunaCo },
  { name: 'Aurora Home', tag: 'Iluminación · Decoración', image: auroraHome },
  { name: 'Retro Play', tag: 'Gaming · Electrónica', image: retroPlay },
]

function PortfolioCard({ project, index, progress, reduceMotion }) {
  const isEven = index % 2 === 0
  const start = index * 0.06
  const end = 0.55 + index * 0.06

  const rotateX = useTransform(progress, [start, end], reduceMotion ? [0, 0] : [22, 0])
  const rotateY = useTransform(progress, [start, end], reduceMotion ? [0, 0] : [isEven ? -10 : 10, 0])
  const y = useTransform(progress, [start, end], reduceMotion ? [0, 0] : [70, 0])
  const scale = useTransform(progress, [start, end], reduceMotion ? [1, 1] : [0.9, 1])
  const opacity = useTransform(progress, [start, start + 0.18], [0, 1])

  return (
    <motion.div
      style={{ rotateX, rotateY, y, scale, opacity, transformPerspective: 1200 }}
      className="card-surface overflow-hidden rounded-xl3 border border-line shadow-card"
    >
      <div className="h-[300px] overflow-hidden sm:h-[340px]">
        <img
          src={project.image}
          alt={`Captura de la tienda ${project.name}`}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="px-5 py-4">
        <h3 className="text-[14px] font-medium text-ink/80">{project.name}</h3>
        <p className="mt-0.5 text-[12px] text-muted2">{project.tag}</p>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.25'],
  })

  return (
    <section ref={sectionRef} className="section-pad relative" style={{ perspective: 1400 }}>
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[640px] text-center"
        >
          <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Tiendas diseñadas para parecer marcas.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2" style={{ transformStyle: 'preserve-3d' }}>
          {PROJECTS.map((project, i) => (
            <PortfolioCard
              key={project.name}
              project={project}
              index={i}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
