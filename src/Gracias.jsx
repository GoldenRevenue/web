import { CheckCircle2, MailCheck, ArrowLeft, HelpCircle } from 'lucide-react'

function hasSessionId() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('session_id')
}

export default function Gracias() {
  const confirmed = hasSessionId()

  return (
    <div className="relative min-h-screen">
      <div className="ambient-bg" />
      <div className="grain-layer" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="card-surface w-full max-w-[480px] rounded-xl3 border-line p-8 text-center shadow-card sm:p-10">
          {confirmed ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand-light">
                <CheckCircle2 size={28} strokeWidth={2.2} />
              </div>
              <h1 className="mt-5 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
                Pago confirmado
              </h1>
              <p className="mt-3 flex items-center justify-center gap-2 text-[14px] text-muted">
                <MailCheck size={16} className="flex-none text-brand-light" />
                Revisa tu correo (y la carpeta de spam) en los próximos minutos.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Te hemos enviado los enlaces de descarga a la dirección usada en el pago.
                Los enlaces caducan pasado un tiempo por seguridad.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] text-muted">
                <HelpCircle size={28} strokeWidth={2.2} />
              </div>
              <h1 className="mt-5 text-[22px] font-extrabold leading-tight text-ink sm:text-[24px]">
                No encontramos ningún pago reciente
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Si acabas de completar una compra, revisa tu correo. Si crees que esto es un
                error, vuelve a intentarlo desde la web.
              </p>
            </>
          )}

          <a href="/" className="btn-ghost mt-7 inline-flex px-5 py-2.5 text-[13px]">
            <ArrowLeft size={14} />
            Volver a la web
          </a>
        </div>
      </div>
    </div>
  )
}
