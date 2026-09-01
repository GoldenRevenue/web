import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Code2, Book, ShieldCheck, Zap } from 'lucide-react'

// Precios en céntimos para evitar errores de redondeo al sumar decimales.
const BASE_PRICE = 2995
const ADDONS = [
  {
    id: 'liquids',
    price: 999,
    Icon: Code2,
    title: '+180 archivos .liquid',
    text: 'Secciones y bloques extra ya maquetados para ampliar la plantilla sin partir de cero.',
  },
  {
    id: 'ebook',
    price: 1499,
    Icon: Book,
    title: 'Ebook premium',
    text: 'Guía avanzada de optimización: velocidad, SEO y conversión aplicados a la plantilla.',
  },
]

function formatPrice(cents) {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`
}

function AddonRow({ addon, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-start gap-4 rounded-xl2 border px-4 py-4 text-left transition-all duration-200 ${
        checked
          ? 'border-brand/40 bg-brand/[0.06]'
          : 'border-line bg-black/20 hover:border-line2'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-colors ${
          checked ? 'border-brand-light bg-brand-light' : 'border-line2 bg-transparent'
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-black" />}
      </span>

      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/[0.04] text-muted">
        <addon.Icon size={16} />
      </span>

      <span className="flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="text-[14px] font-semibold text-ink">{addon.title}</span>
          <span className="text-[13px] font-semibold text-brand-light">+{formatPrice(addon.price)}</span>
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-muted">{addon.text}</span>
      </span>
    </button>
  )
}

export default function Pricing() {
  const [selected, setSelected] = useState({ liquids: false, ebook: false })

  const total =
    BASE_PRICE + ADDONS.reduce((sum, addon) => sum + (selected[addon.id] ? addon.price : 0), 0)

  function toggle(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="precio" className="section-pad relative">
      <div className="container-px mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[640px] text-center"
        >
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-light">
            Precio
          </p>
          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
            Todo lo que necesitas para lanzar tu tienda.
          </h2>
          <p className="mx-auto mt-4 max-w-[460px] text-[15px] text-muted">
            Un pago único por la plantilla. Añade extras solo si los necesitas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="card-surface relative mx-auto mt-14 max-w-[600px] overflow-hidden rounded-xl3 border-line p-6 shadow-card sm:p-9"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(420px 220px at 15% 0%, rgba(168,224,99,0.08), transparent 70%)',
            }}
          />

          <div className="relative flex flex-col gap-1 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-light">
                <Zap size={11} /> Producto principal
              </span>
              <h3 className="mt-3 text-[19px] font-bold text-ink sm:text-[21px]">
                Plantilla Golden Revenue
              </h3>
              <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">
                Tema completo para Shopify + guía básica de instalación paso a paso.
              </p>
            </div>
            <div className="flex flex-none items-baseline gap-1 sm:flex-col sm:items-end">
              <span className="text-[30px] font-extrabold leading-none text-ink">
                {formatPrice(BASE_PRICE)}
              </span>
              <span className="text-[12px] text-muted">pago único</span>
            </div>
          </div>

          <div className="relative mt-6">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
              Extras opcionales
            </p>
            <div className="flex flex-col gap-3">
              {ADDONS.map((addon) => (
                <AddonRow
                  key={addon.id}
                  addon={addon}
                  checked={selected[addon.id]}
                  onToggle={() => toggle(addon.id)}
                />
              ))}
            </div>
          </div>

          <div className="relative mt-7 flex flex-col items-stretch gap-4 rounded-xl2 border border-line bg-elevated px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] text-muted">Total</p>
              <p className="text-[24px] font-extrabold leading-tight text-ink">{formatPrice(total)}</p>
            </div>
            <button type="button" className="btn-primary justify-center px-6 py-3.5 text-[14px]">
              Comprar ahora
              <ArrowUpRight size={16} strokeWidth={2.4} />
            </button>
          </div>

          <p className="relative mt-5 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted">
            <ShieldCheck size={13} className="text-brand-light" />
            Pago seguro · Acceso inmediato tras la compra
          </p>
        </motion.div>
      </div>
    </section>
  )
}
