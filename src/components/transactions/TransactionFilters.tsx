import { Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TransactionFiltersProps {
  onSearch: (query: string) => void
  onFilterCategory: (category: string) => void
  onFilterType: (type: 'all' | 'income' | 'expense') => void
  categories: string[]
}

const typeOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
]

function TransactionFilters({
  onSearch,
  onFilterCategory,
  onFilterType,
  categories,
}: TransactionFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onFilterCategory(category)
  }

  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    setSelectedType(type)
    onFilterType(type)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50/80 py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter toggle button (mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors sm:hidden"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Filter options */}
      <div className={cn('flex flex-wrap gap-3', !showFilters && 'hidden sm:flex')}>
        {/* Type filter */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 bg-gray-50/50">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value as 'all' | 'income' | 'expense')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                selectedType === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TransactionFilters