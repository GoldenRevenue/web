import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Frame, Flame } from 'lucide-react'
import StoreMockup from './ui/StoreMockup'

const PROJECTS = [
  { name: 'Papel & Tinta', tag: 'Librería · Papelería', accent: '#A8E063', variant: 'grid', Icon: BookOpen },
  { name: 'Atlas Estudio', tag: 'Arte · Pósters', accent: '#95BF47', variant: 'alt', Icon: Frame },
  { name: 'Ámbar & Cera', tag: 'Hogar · Velas', accent: '#6FAF32', variant: 'grid', Icon: Flame },
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
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-light">
            Algunos de nuestros proyectos
          </p>
          <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
            Tiendas diseñadas para parecer marcas.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              className="card-surface-hover group relative overflow-hidden rounded-xl3 border border-line shadow-card"
            >
              <div className="relative h-[260px] overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                  <StoreMockup accent={project.accent} variant={project.variant} Icon={project.Icon} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:bg-black/55 group-hover:opacity-100">
                  <span className="btn-primary translate-y-2 px-5 py-2.5 text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Ver proyecto
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{project.name}</h3>
                  <p className="mt-0.5 text-[13px] text-muted">{project.tag}</p>
                </div>
                <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-brand-light" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
