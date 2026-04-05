import { formatCategoryLabel } from '../../../lib/utils'

interface ProductsFiltersProps {
  categories: string[]
  onCategoryChange: (category: string) => void
  onSearchChange: (searchTerm: string) => void
  searchTerm: string
  selectedCategory: string
}

export function ProductsFilters({
  categories,
  onCategoryChange,
  onSearchChange,
  searchTerm,
  selectedCategory,
}: ProductsFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_200px]">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Search
        <input
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product title"
          value={searchTerm}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Category
        <select
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
          onChange={(event) => onCategoryChange(event.target.value)}
          value={selectedCategory}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {formatCategoryLabel(category)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
