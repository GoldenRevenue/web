import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CONSENT_KEY = "golden-revenue-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Pequeño delay para que no aparezca de golpe nada más cargar
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-800/40 bg-neutral-900/95 backdrop-blur-sm shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-neutral-300 leading-relaxed flex-1">
              🍪 Usamos cookies técnicas necesarias para que la web y el
              proceso de compra funcionen correctamente. No usamos cookies de
              analítica ni publicidad. Puedes consultar más detalles en
              nuestra{" "}
              <a
                href="/cookies"
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                Política de Cookies
              </a>
              .
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleAccept}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
