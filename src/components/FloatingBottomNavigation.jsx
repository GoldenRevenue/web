import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Home, AlertCircle, Sparkles, Tag, HelpCircle, ArrowUpRight } from 'lucide-react'
import { CTA_LABEL } from '../config'

const ITEMS = [
  { id: 'inicio', label: 'Inicio', Icon: Home },
  { id: 'problemas', label: 'Problemas', Icon: AlertCircle },
  { id: 'soluciones', label: 'Soluciones', Icon: Sparkles },
  { id: 'precio', label: 'Precio', Icon: Tag },
  { id: 'faq', label: "FAQ's", Icon: HelpCircle },
]

export default function FloatingBottomNavigation() {
  const [active, setActive] = useState('inicio')

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function goTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-3 sm:bottom-6"
    >
      <nav className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-pill border border-line bg-elevated/90 p-1.5 shadow-card backdrop-blur-xl [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-2 text-[13px] font-medium transition-colors sm:px-3.5 ${
                isActive ? 'bg-white/10 text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              <Icon size={15} />
              <span className={isActive ? 'inline' : 'hidden md:inline'}>{label}</span>
            </button>
          )
        })}
        <button
          onClick={() => goTo('cta')}
          className="btn-primary ml-1 shrink-0 px-4 py-2 text-[13px]"
        >
          <span className="hidden md:inline">{CTA_LABEL}</span>
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </button>
      </nav>
    </motion.div>
  )
}
