import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Halaman tidak ditemukan</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage