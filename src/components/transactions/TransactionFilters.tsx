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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors sm:hidden"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className={cn('flex flex-wrap gap-3', !showFilters && 'hidden sm:flex')}>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50/50 dark:bg-gray-800/50">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value as 'all' | 'income' | 'expense')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                selectedType === option.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white dark:focus:border-blue-400"
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