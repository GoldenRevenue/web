// Mockup de tienda construido íntegramente con HTML/CSS, sin imágenes externas.
// `accent` define el tono de marca ficticio de cada proyecto del portfolio.
// `Icon` (componente de lucide-react) da un toque visual propio de la categoría del negocio.
export default function StoreMockup({ accent = '#95BF47', variant = 'grid', Icon }) {
  return (
    <div className="relative h-full w-full bg-[#0a0a0a]">
      {/* barra de navegador */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
      </div>

      {/* header tienda */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="h-2 w-16 rounded-full bg-white/25" />
        <div className="flex gap-3">
          <div className="h-1.5 w-8 rounded-full bg-white/10" />
          <div className="h-1.5 w-8 rounded-full bg-white/10" />
          <div className="h-1.5 w-8 rounded-full bg-white/10" />
        </div>
        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: accent, opacity: 0.85 }} />
      </div>

      {/* hero de la tienda */}
      <div
        className="mx-6 mt-2 flex h-24 items-center justify-center rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${accent}22, transparent 60%), #111`,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex flex-col items-center gap-2.5 text-center">
          {Icon && (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accent}26` }}
            >
              <Icon size={15} style={{ color: accent }} strokeWidth={2} />
            </span>
          )}
          <div className="mx-auto h-2 w-28 rounded-full bg-white/30" />
          <div className="mx-auto h-1.5 w-16 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </div>

      {/* grid de productos */}
      <div className="grid grid-cols-3 gap-2.5 px-6 py-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#111]">
            <div
              className="flex h-12 items-center justify-center"
              style={{
                background:
                  variant === 'grid'
                    ? `linear-gradient(160deg, ${accent}33, #151515)`
                    : `linear-gradient(200deg, #1c1c1c, ${accent}22)`,
              }}
            >
              {Icon && <Icon size={14} style={{ color: accent, opacity: 0.5 }} strokeWidth={1.8} />}
            </div>
            <div className="space-y-1 p-2">
              <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
              <div className="h-1.5 w-1/2 rounded-full" style={{ backgroundColor: accent, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
