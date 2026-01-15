import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product, getMinPriceFromProduct, getTotalStockFromProduct } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickAdd }) => {
  const minPrice = getMinPriceFromProduct(product);
  const totalStock = getTotalStockFromProduct(product);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 p-6 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badge */}
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {product.badge}
          </Badge>
        )}

        {/* Stock indicator */}
        {totalStock < 10 && totalStock > 0 && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-warning/20 text-warning border-warning/30">
            ¡Últimas {totalStock}!
          </Badge>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={() => onSelect(product)}
            className="gap-2 bg-white text-foreground hover:bg-white/90"
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type Badge */}
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.type}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-foreground mt-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xs text-muted-foreground">Desde</span>
            <p className="text-xl font-bold text-primary">
              Bs. {minPrice}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelect(product)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver
            </Button>
            <Button
              size="sm"
              onClick={() => onQuickAdd(product)}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;