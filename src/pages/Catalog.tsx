import React, { useState, useMemo } from 'react';
import { Search, Package, X } from 'lucide-react';
import { CATALOG_PRODUCTS, Product, getProductsByType  } from '@/data/products';
import { CONFIG_DATA } from '@/data/config';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';

type ProductTypeKey = keyof typeof CONFIG_DATA.types;

const Catalog: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ProductTypeKey | null>(null);

  const types = useMemo(() => Object.values(CONFIG_DATA.types), []);

const filteredProducts = useMemo(() => {
  const baseProducts = selectedType ? getProductsByType(selectedType) : CATALOG_PRODUCTS;

  return baseProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  
}, [searchQuery, selectedType]);

  const handleTypeSelect = (typeId: ProductTypeKey | null) => {
    setSelectedType(typeId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-sm">
            Catálogo {new Date().getFullYear()}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4">Catálogo YOLIMAR</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Ropa de calidad y diseños personalizados. Encuentra poleras, blusas, sacos y más.
          </p>
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              variant={selectedType === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeSelect(null)}
              className="flex-shrink-0"
            >
              <Package className="w-4 h-4 mr-2" />
              Todos
            </Button>
            {types.map(type => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeSelect(type.id as ProductTypeKey)}
                className="flex-shrink-0"
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Mostrando {filteredProducts.length} de {CATALOG_PRODUCTS.length} productos
            {selectedType && ` en ${CONFIG_DATA.types[selectedType].name}`}
          </p>
          {(searchQuery || selectedType) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground">
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No se encontraron productos</h3>
            <p className="text-muted-foreground mt-1">
              {selectedType
                ? `No hay productos en la categoría ${CONFIG_DATA.types[selectedType].name}`
                : 'Intenta con otros términos de búsqueda'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onQuickAdd={setQuickAddProduct}
              />
            ))}
          </div>
        )}
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <ProductModal product={quickAddProduct} onClose={() => setQuickAddProduct(null)} />

      <Footer />
    </main>
  );
};

export default Catalog;