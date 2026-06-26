import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-center shadow-2xl shadow-blue-500/25"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 border border-white/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Mulai Sekarang Gratis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Siap Mengatur Keuangan dengan Lebih Baik?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan mengelola keuangan bersama CashFlow+
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                Daftar Gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA