import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.slug}`)}>
      <div className="product-image">
        <img src={product.images?.[0]} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.basePrice.toFixed(2)} MXN</p>
        <div className="product-bottom">
          <span>Talla: {product.variants?.[0]?.size || 'Única'}</span>
          <button 
            className="heart-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
              if (onAddToCart) onAddToCart(product);
            }}
            style={{ color: isWishlisted ? '#ff4d4f' : 'inherit', transition: 'color 0.2s' }}
          >
            <Heart size={14} strokeWidth={2} fill={isWishlisted ? '#ff4d4f' : 'transparent'} />
          </button>
        </div>
      </div>
    </div>
  )
}