import { Heart, Github, Twitter, Instagram } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-gray-900">CashFlow+</span>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Kelola keuangan pribadi dengan mudah dan cerdas.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Produk</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-700 cursor-pointer">Fitur</li>
              <li className="hover:text-gray-700 cursor-pointer">Harga</li>
              <li className="hover:text-gray-700 cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Perusahaan</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li className="hover:text-gray-700 cursor-pointer">Tentang</li>
              <li className="hover:text-gray-700 cursor-pointer">Blog</li>
              <li className="hover:text-gray-700 cursor-pointer">Karir</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Ikuti Kami</h4>
            <div className="mt-3 flex items-center gap-3">
              <Github className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 CashFlow+. Dibuat dengan{' '}
            <Heart className="inline h-3 w-3 text-red-400 fill-red-400" />
            {' '}di Indonesia.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-600 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer