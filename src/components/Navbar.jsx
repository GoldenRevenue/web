import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { BRAND_NAME, CTA_LABEL, NAV_LINKS } from '../config'

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const { scrollY } = useScroll()
  const paddingY = useTransform(scrollY, [0, 120], [18, 10])
  const maxWidth = useTransform(scrollY, [0, 120], [1180, 980])
  const bg = useTransform(
    scrollY,
    [0, 120],
    ['rgba(13,13,13,0.72)', 'rgba(10,10,10,0.92)']
  )

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 22px)' }}
    >
      <motion.nav
        style={{ paddingTop: paddingY, paddingBottom: paddingY, maxWidth, backgroundColor: bg }}
        className="w-full flex items-center justify-between gap-3 rounded-pill border border-line px-4 backdrop-blur-xl transition-shadow sm:gap-6 sm:px-6"
      >
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('inicio')
          }}
          className="flex min-w-0 items-center gap-1 truncate text-[13px] font-extrabold tracking-tight text-ink sm:text-[15px]"
        >
          {BRAND_NAME.toUpperCase()}
          <span className="text-brand-light">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-7 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(link.id)
                }}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#precio"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('precio')
          }}
          className="btn-primary px-3 py-2.5 text-[13px] sm:px-5 sm:text-sm whitespace-nowrap flex-none"
        >
          <span className="hidden sm:inline">{CTA_LABEL}</span>
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </a>
      </motion.nav>
    </motion.header>
  )
}
