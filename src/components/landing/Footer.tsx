import { Heart, Github, Twitter, Instagram } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">CashFlow+</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Kelola keuangan pribadi dengan mudah dan cerdas.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Produk</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">Fitur</li>
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">Harga</li>
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Perusahaan</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">Tentang</li>
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">Karir</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Ikuti Kami</h4>
            <div className="mt-3 flex items-center gap-3">
              <Github className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2026 CashFlow+. Dibuat dengan{' '}
            <Heart className="inline h-3 w-3 text-red-400 dark:text-red-500 fill-red-400 dark:fill-red-500" />
            {' '}di Indonesia.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer