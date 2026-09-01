import { motion } from 'framer-motion'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import FloatingShopifyVisual from './FloatingShopifyVisual'

export default function Hero() {
  return (
    <section id="inicio" className="relative section-pad pt-[150px] sm:pt-[170px]">
      <div className="container-px mx-auto flex max-w-content flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-7 inline-flex items-center gap-2 rounded-pill border border-line bg-white/[0.03] px-4 py-2 text-[13px] text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
          </span>
          Pago único, sin mensualidades
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-[880px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink"
          style={{ fontSize: 'clamp(40px, 6.4vw, 76px)' }}
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            Convertimos tu
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="inline-block align-middle"
              style={{ fontSize: '0.52em' }}
            >
              <span className="inline-flex animate-float-slow items-center gap-2 rounded-2xl border border-line2 bg-elevated px-4 py-1.5 shadow-card">
                <ShoppingBag className="h-[0.9em] w-[0.9em] text-brand-light" strokeWidth={2.4} />
                <span className="font-bold text-ink">Shopify</span>
              </span>
            </motion.span>
          </span>
          <span className="block">en una marca que vende</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-7 max-w-[560px] text-[15px] leading-relaxed text-muted sm:text-base"
        >
          Más que una tienda online. Diseñamos experiencias de compra pensadas
          para convertir visitantes en clientes.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#cta"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="btn-primary mt-9 px-7 py-3.5 text-[15px]"
        >
          Quiero transformar mi tienda
          <ArrowUpRight size={18} strokeWidth={2.4} />
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="w-full"
        >
          <FloatingShopifyVisual />
        </motion.div>
      </div>
    </section>
  )
}
