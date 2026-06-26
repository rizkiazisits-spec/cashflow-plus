import { Hero, FeatureCards, CTA, Footer } from '@/components/landing'

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureCards />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage