import { motion } from 'framer-motion'
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

export default function Portfolio() {
  return (
    <section className="section-pad relative">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[640px] text-center"
        >
          <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Tiendas diseñadas para parecer marcas.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
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
          ))}
        </div>
      </div>
    </section>
  )
}
