import { Linkedin, Instagram, Youtube } from 'lucide-react'
import { BRAND_NAME, CTA_LABEL, NAV_LINKS } from '../config'

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Footer() {
  return (
    <footer className="relative border-t border-line pb-32 pt-14 sm:pb-16">
      <div className="container-px mx-auto max-w-content">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <span className="text-[15px] font-extrabold tracking-tight text-ink">
            {BRAND_NAME.toUpperCase()}
            <span className="text-brand-light">.</span>
          </span>

          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
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
            className="btn-ghost px-4 py-2 text-sm"
          >
            {CTA_LABEL} ↗
          </a>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-6 border-t border-line pt-8 sm:flex-row sm:justify-between">
          <p className="text-[13px] text-muted2">
            © 2026 {BRAND_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-muted">
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn" className="transition-colors hover:text-ink">
              <Linkedin size={16} />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram" className="transition-colors hover:text-ink">
              <Instagram size={16} />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="YouTube" className="transition-colors hover:text-ink">
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
