import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { EASE_BRAND } from '../constants/animation'

const ITEMS = [
  {
    q: '¿Cómo recibo la plantilla tras la compra?',
    a: 'Acceso inmediato: al completar el pago recibes un enlace de descarga con los archivos de la plantilla y una guía de instalación paso a paso.',
  },
  {
    q: '¿Necesito saber programar para instalarla?',
    a: 'No. Se instala como cualquier tema de Shopify desde tu propio panel de administración, y se personaliza sin tocar una línea de código.',
  },
  {
    q: '¿Puedo instalarla sobre mi tienda actual sin perder mis datos?',
    a: 'Sí. La instalación cambia solo el diseño: tu catálogo, tus clientes y tus pedidos se mantienen intactos.',
  },
  {
    q: '¿Puedo usar mi propio dominio?',
    a: 'Por supuesto. La plantilla funciona con cualquier dominio ya conectado a tu tienda Shopify.',
  },
  {
    q: '¿Incluye el diseño responsive?',
    a: 'Sí, está probada y optimizada en móvil, tablet y escritorio antes de ponerla a la venta.',
  },
  {
    q: '¿Qué pasa si tengo un problema durante la instalación?',
    a: 'Cada compra incluye soporte por email para resolver dudas de instalación y configuración inicial.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-medium text-ink sm:text-base">{item.q}</span>
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line text-muted transition-colors">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_BRAND }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-[14px] leading-relaxed text-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="section-pad relative">
      <div className="container-px mx-auto max-w-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
          className="text-center"
        >
          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
            Preguntas frecuentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_BRAND }}
          className="mt-12 rounded-xl3 border border-line bg-surface px-6 sm:px-8"
        >
          {ITEMS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
