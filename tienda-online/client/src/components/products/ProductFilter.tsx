import type { Category } from "../../types";

interface ProductFilterProps {
  categories: Category[]
  currentCategoryId: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export default function ProductFilter({ categories, currentCategoryId, onCategoryChange }: ProductFilterProps) {
  return (
    <div className="product-filter" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Filtrar por categoría
      </h3>
      <select
        value={currentCategoryId || ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '0.8rem',
          background: '#151515',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
      >
        <option value="">Todas las Categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>
  )
}