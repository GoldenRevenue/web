import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="relative section-pad pt-[150px] sm:pt-[170px]">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-xl3 border border-line bg-surface px-6 py-20 text-center sm:px-10 sm:py-28"
        >
          <div className="relative">
            <h2
              className="mx-auto max-w-[640px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink"
              style={{ fontSize: 'clamp(30px, 5vw, 48px)' }}
            >
              Tu tienda puede verse diferente.
              <span className="block">Vamos a construirla.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[440px] text-[15px] text-muted">
              Cuéntanos qué quieres conseguir y veremos cómo podemos llevar tu Shopify al siguiente nivel.
            </p>
            <a
              href="#precio"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('precio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="btn-primary mt-9 px-7 py-3.5 text-[15px]"
            >
              Trabajemos juntos
              <ArrowUpRight size={18} strokeWidth={2.4} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
