import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-40%] left-[-20%] h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-[120px]" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-200/10 blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100/50 px-4 py-1.5 text-sm text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Kelola keuangan jadi lebih mudah</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Kelola Keuangan{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Lebih Cerdas
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            CashFlow+ membantu Anda mencatat pemasukan, mengelola pengeluaran, 
            dan mencapai target tabungan dengan visualisasi yang mudah dipahami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
            Mulai Gratis
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300">
            <Zap className="h-4 w-4" />
            Lihat Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>100% Gratis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Tanpa kartu kredit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Data aman</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Dukung 5.000+ pengguna</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero