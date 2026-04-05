import { formatCategoryLabel } from '../../../lib/utils'

interface ProductsCategoryChipsProps {
  categories: string[]
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export function ProductsCategoryChips({
  categories,
  onSelectCategory,
  selectedCategory,
}: ProductsCategoryChipsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
          selectedCategory === 'all'
            ? 'bg-ink text-white'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-accent-200 hover:text-accent-700'
        }`}
        onClick={() => onSelectCategory('all')}
        type="button"
      >
        All
      </button>
      {categories.map((category) => (
        <button
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
            selectedCategory === category
              ? 'bg-ink text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-accent-200 hover:text-accent-700'
          }`}
          key={category}
          onClick={() => onSelectCategory(category)}
          type="button"
        >
          {formatCategoryLabel(category)}
        </button>
      ))}
    </div>
  )
}
