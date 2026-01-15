import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Minus, Plus, ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import { Product, getColorsFromProduct, getSizesFromProduct, getExactVariant, getAvailableSizesForColor, isVariantAvailable } from '@/data/products';
import { getPriceWithCatalogDiscount } from '@/data/config';
import { COLOR_MAP, COLOR_NAMES } from '@/data/colors';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  // ✅ ESTADOS DERIVADOS CON MEMOIZACIÓN
  const colors = useMemo(() => product ? getColorsFromProduct(product) : [], [product]);
  const sizes = useMemo(() => product ? getSizesFromProduct(product) : [], [product]);
  
  const availableSizesForColor = useMemo(() => {
    if (!product || !selectedColor) return [];
    return getAvailableSizesForColor(product, selectedColor);
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return undefined;
    return getExactVariant(product, selectedColor, selectedSize);
  }, [product, selectedColor, selectedSize]);

  const stock = selectedVariant?.stock || 0;

  // ✅ CÁLCULO DE PRECIOS CON DESCUENTO DE CATÁLOGO
  const priceInfo = useMemo(() => {
    if (!selectedVariant || !product) return null;
    
    const discountInfo = getPriceWithCatalogDiscount(product.type, selectedSize, quantity);
    
    return {
      unitPrice: discountInfo.unitPrice,
      originalPrice: discountInfo.basePrice,
      totalPrice: discountInfo.totalPrice,
      discountPercentage: discountInfo.discountPercentage,
      hasDiscount: discountInfo.hasDiscount,
      totalDiscount: discountInfo.totalDiscount,
      minQuantity: discountInfo.minQuantity,
      discountDescription: discountInfo.description
    };
  }, [selectedVariant, product, selectedSize, quantity]);

  // ✅ RESET COMPLETO AL CAMBIAR DE PRODUCTO
  useEffect(() => {
    if (!product) return;

    console.log('🔄 Reseteado selección para producto:', product.id, product.name);
    
    // RESET COMPLETO - No mantener nada del producto anterior
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);
    setValidationError('');
    setIsLoading(false);

    // Esperar un frame para que React actualice el estado antes de inicializar
    const timer = setTimeout(() => {
      const colors = getColorsFromProduct(product);
      const sizes = getSizesFromProduct(product);
      
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
        // La talla se seleccionará automáticamente después
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [product]);

  // ✅ SELECCIÓN AUTOMÁTICA LIMPIA
  useEffect(() => {
    if (!product || !selectedColor) return;

    // Obtener tallas disponibles para el color ACTUAL (no el anterior)
    const availableSizes = getAvailableSizesForColor(product, selectedColor);
    
    if (availableSizes.length === 0) {
      setSelectedSize('');
      setValidationError('No hay stock disponible para este color');
      return;
    }

    // Seleccionar la PRIMERA talla disponible (no mantener la anterior)
    setSelectedSize(availableSizes[0]);
    setValidationError('');
    
  }, [product, selectedColor]);

  // ✅ FUNCIONES DE MANEJO CON VALIDACIÓN
  const handleColorChange = (color: string) => {
    console.log('Cambiando color a:', color);
    setSelectedColor(color);
  };

  const handleSizeChange = (size: string) => {
    console.log('Cambiando talla a:', size);
    if (!product || !selectedColor) return;
    
    if (isVariantAvailable(product, selectedColor, size)) {
      setSelectedSize(size);
      setValidationError('');
    } else {
      setValidationError(`La combinación ${selectedColor} - ${size} no está disponible`);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      setValidationError(`Máximo stock disponible: ${stock}`);
      setQuantity(stock);
    } else {
      setQuantity(newQuantity);
      setValidationError('');
    }
  };

  const handleAddToCart = () => {
    console.log('Intentando agregar al carrito...');
    
    if (!selectedVariant) {
      setValidationError('Por favor selecciona una variante válida');
      return;
    }

    if (stock === 0) {
      setValidationError('Producto sin stock');
      return;
    }

    if (!priceInfo) {
      setValidationError('Error al calcular el precio');
      return;
    }

    setIsLoading(true);

    const cartItem = {
      productId: product.id,
      name: product.name,
      type: product.type,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: priceInfo.unitPrice,
      image: product.image,
      sku: selectedVariant.sku,
      isCustom: false,
      originalPrice: priceInfo.originalPrice,
      discountApplied: priceInfo.totalDiscount,
      discountPercentage: priceInfo.discountPercentage
    };

    console.log('✅ Agregando al carrito:', cartItem);
    addItem(cartItem);
    
    // Mostrar confirmación antes de cerrar
    setTimeout(() => {
      onClose();
      setIsLoading(false);
    }, 500);
  };

  if (!product) {
    console.log('Modal: No hay producto');
    return null;
  }

  console.log('Modal renderizando - Producto:', product.name, 'Color:', selectedColor, 'Talla:', selectedSize);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-background rounded-2xl z-50 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-4 border-b bg-muted/50">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          <Badge variant="secondary" className="mb-2">{product.type}</Badge>
          <h2 className="text-xl font-bold pr-8">{product.name}</h2>
          {selectedVariant && (
            <p className="text-sm text-muted-foreground mt-1">
              Código: {selectedVariant.sku}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* Image */}
          <div className="md:w-1/2 bg-gradient-to-br from-muted to-muted/50 p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-[250px] h-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-6 space-y-4">
            {/* Descripción */}
            <div>
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Material: {product.material}
              </p>
            </div>

            {/* Error de validación */}
            {validationError && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {validationError}
              </div>
            )}

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Color: {COLOR_NAMES[selectedColor] || selectedColor}
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => {
                  const availableSizes = getAvailableSizesForColor(product, color);
                  const isAvailable = availableSizes.length > 0;
                  
                  return (
                    <button
                      key={color}
                      onClick={() => isAvailable && handleColorChange(color)}
                      disabled={!isAvailable}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor === color 
                          ? 'border-primary ring-2 ring-primary/30 scale-110' 
                          : isAvailable
                          ? 'border-gray-200 hover:scale-105'
                          : 'border-gray-200 opacity-40 cursor-not-allowed'
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color] || '#ccc' }}
                      title={`${COLOR_NAMES[color] || color} ${!isAvailable ? '(Sin stock)' : ''}`}
                    >
                      {selectedColor === color && (
                        <Check className={`w-4 h-4 mx-auto ${color === 'blanco' || color === 'amarillo' ? 'text-gray-800' : 'text-white'}`} />
                      )}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <X className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Talla</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => {
                  const isAvailable = isVariantAvailable(product, selectedColor, size);
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && handleSizeChange(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isAvailable
                          ? 'border-border hover:border-primary'
                          : 'border-border opacity-40 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {availableSizesForColor.length === 0 && selectedColor && (
                <p className="text-xs text-warning mt-1">
                  No hay tallas disponibles para el color {COLOR_NAMES[selectedColor] || selectedColor}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-3 block">Cantidad</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {stock > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Stock: {stock}
                  </span>
                )}
              </div>
              {stock === 0 && selectedColor && selectedSize && (
                <p className="text-xs text-destructive mt-1">
                  Sin stock para esta combinación
                </p>
              )}
            </div>

            {/* Stock availability */}
            {stock > 0 && stock <= 5 && (
              <div className="bg-warning/10 text-warning rounded-lg p-3 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ¡Solo quedan {stock} unidades!
              </div>
            )}

            {/* Price Info - SIN DECIMALES */}
            {priceInfo && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Precio unitario:</span>
                  {quantity >= priceInfo.minQuantity ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-muted-foreground">
                        Bs. {priceInfo.originalPrice}
                      </span>
                      <span className="font-semibold text-primary">
                        Bs. {priceInfo.unitPrice}
                      </span>
                    </div>
                  ) : (
                    <span>Bs. {priceInfo.unitPrice}</span>
                  )}
                </div>
                
                {quantity >= priceInfo.minQuantity && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Descuento {priceInfo.discountPercentage}%:</span>
                    <span>-Bs. {priceInfo.totalDiscount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total ({quantity} unidad{quantity > 1 ? 'es' : ''}):</span>
                  <span className="text-primary">Bs. {priceInfo.totalPrice}</span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              className="w-full h-12 text-base gap-2"
              onClick={handleAddToCart}
              disabled={!selectedVariant || stock === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;