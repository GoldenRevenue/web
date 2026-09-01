import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Problems from './components/Problems'
import Solutions from './components/Solutions'
import Methodology from './components/Methodology'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'
import FloatingBottomNavigation from './components/FloatingBottomNavigation'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="ambient-bg" />
      <div className="grain-layer" />

      <div className="relative z-10">
        <Navbar />
        <main>
          <CTA />
          <Hero />
          <Portfolio />
          <Problems />
          <Solutions />
          <Methodology />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>

      <FloatingBottomNavigation />
    </div>
  )
}
