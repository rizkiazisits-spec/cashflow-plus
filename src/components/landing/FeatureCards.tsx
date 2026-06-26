import { motion } from 'framer-motion'
import { Wallet, TrendingUp, PiggyBank, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Catat Transaksi',
    description: 'Catat pemasukan dan pengeluaran dengan mudah. Atur kategori dan lihat riwayat transaksi secara lengkap.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Kelola Budget',
    description: 'Buat budget bulanan untuk setiap kategori. Pantau pengeluaran agar tidak melebihi batas yang ditentukan.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: PiggyBank,
    title: 'Target Tabungan',
    description: 'Tentukan target tabungan dan lacak progresnya. Dapatkan motivasi visual untuk mencapai tujuan keuangan.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Statistik & Laporan',
    description: 'Lihat visualisasi keuangan Anda dalam grafik interaktif. Download laporan untuk analisis lebih mendalam.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function FeatureCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm text-blue-700 border border-blue-100/50 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Fitur Unggulan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Kelola Keuangan dengan{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lebih Mudah
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Semua fitur dirancang untuk membantu Anda mencapai kebebasan finansial
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
              <div className={`mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureCards