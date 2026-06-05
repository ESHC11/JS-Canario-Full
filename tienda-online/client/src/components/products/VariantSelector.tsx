import type { ProductVariant } from "../../types";

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({ variants, selectedVariant, onSelectVariant }: VariantSelectorProps) {
    if (!variants || variants.length === 0) return null;

    return (
        <div style={{ margin: '1.5rem 0' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#ccc' }}>Opciones disponibles:</h4>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    
                    return (
                        <button
                            key={variant.id}
                            onClick={() => onSelectVariant(variant)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: isSelected ? '2px solid #fff' : '1px solid #444',
                                borderRadius: '8px',
                                background: isSelected ? '#333' : 'transparent',
                                color: isSelected ? '#fff' : '#aaa',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {/* Muestra la talla, el color, o el SKU si no hay ninguno */}
                            {variant.size || variant.color || variant.sku}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
