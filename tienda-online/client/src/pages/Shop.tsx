import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import type { Product, Category } from "../types";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)

      // Leer parámetro de la URL
      const categoryQuery = searchParams.get('category');
      if (categoryQuery) {
        const match = categoriesData.find(c => c.name.toLowerCase() === categoryQuery.toLowerCase());
        if (match) {
          setCurrentCategoryId(match.id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (id: string | null) => {
    setCurrentCategoryId(id);
    const params: Record<string, string> = {};
    
    const search = searchParams.get('search');
    if (search) params.search = search;
    
    if (id) {
      const match = categories.find(c => c.id === id);
      if (match) params.category = match.name;
    }
    
    setSearchParams(params);
  }

  // Filtrar productos por categoría seleccionada y término de búsqueda
  const searchQuery = searchParams.get('search')?.toLowerCase() || "";

  const filteredProducts = products.filter(p => {
    const matchCategory = currentCategoryId ? p.categoryId === currentCategoryId : true;
    
    const matchSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery) || (p.description?.toLowerCase().includes(searchQuery))
      : true;

    return matchCategory && matchSearch;
  });

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando productos...</div>
  if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#e74c3c' }}>Error: {error}</div>

  return (
    <main>
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Tienda</h2>
        </div>

        <ProductFilter
          categories={categories}
          currentCategoryId={currentCategoryId}
          onCategoryChange={handleCategoryChange}
        />

        <ProductGrid products={filteredProducts} />
      </section>
    </main>
  )
}