import { useMemo } from 'react'
import PropTypes from 'prop-types'

export default function CategoryFilter({ products, onSelectCategory, activeCategory }) {
  const categories = useMemo(() => {
    const seen = new Set()
    const result = []
    for (const p of products) {
      const id = Number(p.category)
      if (!seen.has(id)) {
        seen.add(id)
        result.push({ id, name: p.category_name || `Categoría ${id}` })
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 lg:px-8 pb-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full text-xs font-bold font-display cursor-pointer transition-all duration-[0.22s] border-[1.5px] ${
          activeCategory === null
            ? 'bg-green text-white border-green shadow-[0_2px_10px_rgba(64,201,42,0.25)]'
            : 'bg-surface text-text-2 border-border hover:border-green hover:text-green'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold font-display cursor-pointer transition-all duration-[0.22s] border-[1.5px] ${
            activeCategory === cat.id
              ? 'bg-green text-white border-green shadow-[0_2px_10px_rgba(64,201,42,0.25)]'
              : 'bg-surface text-text-2 border-border hover:border-green hover:text-green'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

CategoryFilter.propTypes = {
  products: PropTypes.array.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  activeCategory: PropTypes.number,
}
