import React, { useState, useMemo, useCallback } from 'react';
import { Palette, Shirt, Grid3X3, ShoppingCart, Sparkles, Search, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { SHIRT_TYPES, DESIGNS_DB, getMaterial, getShirtImage, getDefaultDesign, getDesignById } from '@/data/designs';
import { COLOR_MAP, COLOR_NAMES } from '@/data/colors';
import { getPriceByTypeAndSize, getPriceWithDesignDiscount } from '@/data/config';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PREVIEW_DESIGN_SIZES = {
  mobile: { width: 80, height: 80 },
  desktop: { width: 330, height: 330 }
};

const CART_DESIGN_SIZES_BY_TYPE = {
  Algodon: { width: 80, height: 80 },
  Poliester: { width: 75, height: 75 },
  CuelloV: { width: 70, height: 70 },
  TOP: { width: 85, height: 85 }
};

type DesignPosition = 'left' | 'center' | 'right';

const DESIGN_POSITIONS: Record<DesignPosition, { label: string; xOffset: number }> = {
  left: { label: 'Izquierda', xOffset: -80 },
  center: { label: 'Centro', xOffset: 0 },
  right: { label: 'Derecha', xOffset: 80 }
};

const DESIGN_SIZES_BY_SHIRT_TYPE = {
  mobile: {
    Algodon: { width: 80, height: 80 },
    Poliester: { width: 75, height: 75 },
    CuelloV: { width: 70, height: 70 },
    TOP: { width: 85, height: 85 }
  },
  desktop: {
    Algodon: { width: 290, height: 290 },
    Poliester: { width: 250, height: 250 },
    CuelloV: { width: 240, height: 240 },
    TOP: { width: 200, height: 220 }
  }
};

const DESIGN_VERTICAL_OFFSETS = {
  Algodon: 0,
  Poliester: 0,
  CuelloV: -10,
  TOP: 25
};

interface CartItemCustom {
  productId: number;
  name: string;
  type: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  isCustom: boolean;
  designId: number;
  designCode: string;
  designName: string;
  shirtType: string;
  previewImage?: string;
  designPosition?: DesignPosition;
}

const Designer: React.FC = () => {
  const { addItem } = useCart();

  const [shirtType, setShirtType] = useState('Algodon');
  const [shirtColor, setShirtColor] = useState('blanco');
  const [selectedDesign, setSelectedDesign] = useState(getDefaultDesign());
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [searchDesign, setSearchDesign] = useState('');
  const [imageError, setImageError] = useState(false);
  const [designPosition, setDesignPosition] = useState<DesignPosition>('center');
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 640);

  React.useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    setDesignPosition('center');
  }, [selectedDesign]);

  const currentShirt = SHIRT_TYPES[shirtType];
  const shirtImageData = getShirtImage(shirtType, shirtColor);
  const shirtColorHex = shirtImageData.hex;
  const shirtImage = shirtImageData.img;
  const shirtImageDefault = shirtImageData.imgDefault;
  
  const basePrice = getPriceByTypeAndSize('polera', selectedSize, true);
  
  const priceInfo = useMemo(() => {
    return getPriceWithDesignDiscount(selectedSize, quantity, basePrice);
  }, [selectedSize, quantity, basePrice]);

  const previewDesignSize = useMemo(() => {
    const screenType = isLargeScreen ? 'desktop' : 'mobile';
    return DESIGN_SIZES_BY_SHIRT_TYPE[screenType][shirtType] || DESIGN_SIZES_BY_SHIRT_TYPE[screenType].Algodon;
  }, [isLargeScreen, shirtType]);

  const filteredDesigns = useMemo(() => {
    if (!searchDesign.trim()) {
      return DESIGNS_DB;
    }

    const searchLower = searchDesign.toLowerCase();
    return DESIGNS_DB.filter(design =>
      design.name.toLowerCase().includes(searchLower) ||
      design.referencias.some(ref => ref.toLowerCase().includes(searchLower)) ||
      design.code.toLowerCase().includes(searchLower)
    );
  }, [searchDesign]);

  const getDesignXOffset = useCallback((): number => {
    const positionData = DESIGN_POSITIONS[designPosition];
    
    if (!isLargeScreen) {
      const mobileOffsets = {
        left: -30,
        center: 0,
        right: 30
      };
      return mobileOffsets[designPosition];
    }
    
    return positionData.xOffset;
  }, [designPosition, isLargeScreen]);

  const getDesignYOffset = useCallback((): number => {
    const screenType = isLargeScreen ? 'desktop' : 'mobile';
    const mobileScale = screenType === 'mobile' ? 0.4 : 1;
    
    return DESIGN_VERTICAL_OFFSETS[shirtType] * mobileScale;
  }, [shirtType, isLargeScreen]);

  const generatePreviewImage = useCallback(async (): Promise<string> => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      if (!ctx) return '/placeholder.svg';

      ctx.fillStyle = shirtColorHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const shirtImg = new Image();
      shirtImg.crossOrigin = 'anonymous';
      shirtImg.src = imageError ? shirtImageDefault : shirtImage;

      return new Promise((resolve) => {
        shirtImg.onload = () => {
          ctx.drawImage(shirtImg, 0, 0, canvas.width, canvas.height);

          const designImg = new Image();
          designImg.crossOrigin = 'anonymous';
          designImg.src = selectedDesign.img;

          designImg.onload = () => {
            const cartSize = CART_DESIGN_SIZES_BY_TYPE[shirtType] || CART_DESIGN_SIZES_BY_TYPE.Algodon;
            let designX = (canvas.width - cartSize.width) / 2;
            let designY = (canvas.height - cartSize.height) / 2;
            
            if (designPosition === 'left') {
              designX = designX - 20;
            } else if (designPosition === 'right') {
              designX = designX + 20;
            }
            
            const verticalOffset = DESIGN_VERTICAL_OFFSETS[shirtType] || 0;
            designY = designY + verticalOffset;
            
            ctx.drawImage(designImg, designX, designY, cartSize.width, cartSize.height);
            resolve(canvas.toDataURL());
          };

          designImg.onerror = () => {
            resolve(canvas.toDataURL());
          };
        };

        shirtImg.onerror = () => {
          ctx.drawImage(shirtImg, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
        };
      });
    } catch (error) {
      console.error('Error generando preview:', error);
      return '/placeholder.svg';
    }
  }, [shirtColorHex, shirtImage, shirtImageDefault, imageError, selectedDesign.img, shirtType, designPosition]);

  const handleAddToCart = useCallback(async () => {
    const previewImage = await generatePreviewImage();

    const cartItem: CartItemCustom = {
      productId: 1000 + selectedDesign.id,
      name: `Polera Personalizada - ${selectedDesign.name}`,
      type: 'polera',
      color: shirtColor,
      size: selectedSize,
      quantity,
      price: basePrice,
      image: previewImage,
      isCustom: true,
      designId: selectedDesign.id,
      designCode: selectedDesign.code,
      designName: selectedDesign.name,
      shirtType: shirtType,
      previewImage: previewImage,
      designPosition: designPosition
    };

    addItem(cartItem);
    
    // ✅ NUEVO: Resetear cantidad a 1 después de agregar al carrito
    setQuantity(1);
  }, [selectedDesign, shirtColor, selectedSize, quantity, basePrice, shirtType, generatePreviewImage, addItem, designPosition]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="bg-gradient-to-r from-custom to-primary text-white py-6 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-3 md:mb-4 text-xs md:text-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Diseñador Interactivo
          </Badge>
          <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2">
            Crea tu Polera Personalizada
          </h1>
          <p className="text-sm md:text-lg opacity-90">
            Elige tipo, color, diseño y talla. ¡Hazla única!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Preview */}
          <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6 lg:sticky lg:top-24 h-fit order-1 lg:order-1">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
              <Shirt className="w-4 md:w-5 h-4 md:h-5 text-primary" />
              Vista Previa
            </h2>

            <div
              className="aspect-square rounded-lg md:rounded-xl flex items-center justify-center relative overflow-hidden bg-muted w-full mx-auto"
              style={{ backgroundColor: shirtColorHex }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={imageError ? shirtImageDefault : shirtImage}
                  alt={`Polera ${shirtColor}`}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{
                  transform: `translate(${getDesignXOffset()}px, ${getDesignYOffset()}px)`
                }}
              >
                <img
                  src={selectedDesign.img}
                  alt={selectedDesign.name}
                  className="object-contain"
                  style={{
                    width: `${previewDesignSize.width}px`,
                    height: `${previewDesignSize.height}px`
                  }}
                />
              </div>

              <Badge className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 text-white border-0 text-xs md:text-sm">
                Talla {selectedSize}
              </Badge>
            </div>

            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-muted/50 rounded-lg md:rounded-xl">
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Tipo</span>
                  <p className="font-medium text-sm">{shirtType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Material</span>
                  <p className="font-medium text-sm">{getMaterial(shirtType)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Color</span>
                  <p className="font-medium text-sm">{COLOR_NAMES[shirtColor] || shirtColor}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Diseño</span>
                  <p className="font-medium text-sm">{selectedDesign.name}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Código:</span>
                  <span className="font-mono font-bold text-sm text-primary">{selectedDesign.code}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-muted/50 rounded-lg md:rounded-xl">
              <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3">Posición del Diseño</h4>
              <div className="flex gap-2 justify-center">
                {(Object.entries(DESIGN_POSITIONS) as [DesignPosition, typeof DESIGN_POSITIONS[DesignPosition]][]).map(([position, data]) => (
                  <button
                    key={position}
                    onClick={() => setDesignPosition(position)}
                    className={`flex-1 px-2 md:px-3 py-2 md:py-2 rounded-lg border text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                      designPosition === position
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-pressed={designPosition === position}
                    aria-label={`Posicionar diseño ${data.label}`}
                  >
                    {position === 'left' && <ChevronLeft className="w-3 h-3" />}
                    {data.label}
                    {position === 'right' && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-3 md:mt-4 space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs md:text-sm">Precio unitario</span>
                {quantity >= priceInfo.minQuantity ? (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground text-sm">Bs. {priceInfo.basePrice}</span>
                    <span className="text-xl md:text-2xl font-bold text-primary">Bs. {priceInfo.unitPrice}</span>
                  </div>
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-primary">Bs. {priceInfo.unitPrice}</span>
                )}
              </div>

              {quantity >= priceInfo.minQuantity && (
                <div className="text-xs md:text-sm text-success text-center">
                  🎉 Descuento {priceInfo.discountPercentage}%: -Bs. {priceInfo.totalDiscount}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                <div className="flex items-center border rounded-lg w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    aria-label="Disminuir cantidad"
                    className="text-xs md:text-sm h-8 md:h-10"
                  >
                    -
                  </Button>
                  <span className="px-3 md:px-4 font-bold text-sm md:text-base" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    aria-label="Aumentar cantidad"
                    className="text-xs md:text-sm h-8 md:h-10"
                  >
                    +
                  </Button>
                </div>
                <Button
                  className="flex-1 sm:flex-none gap-2 text-xs md:text-sm h-8 md:h-10"
                  onClick={handleAddToCart}
                  aria-label={`Agregar ${quantity} polera(s) al carrito por Bs. ${priceInfo.totalPrice}`}
                >
                  <ShoppingCart className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="hidden sm:inline">Agregar</span>
                  <span className="sm:hidden">Bs. {priceInfo.totalPrice}</span>
                </Button>
              </div>

              {quantity >= priceInfo.minQuantity && (
                <p className="text-xs md:text-sm text-success text-center" role="status">
                  Total: Bs. {priceInfo.totalPrice}
                </p>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-6 order-2 lg:order-2">
            {/* Shirt Type */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6">
              <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Shirt className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                Tipo de Polera
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {Object.keys(SHIRT_TYPES).map(type => (
                  <button
                    key={type}
                    onClick={() => setShirtType(type)}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl border text-center transition-all text-xs md:text-sm ${
                      shirtType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-pressed={shirtType === type}
                    aria-label={`Seleccionar tipo de polera: ${type}`}
                  >
                    <span className="font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6">
              <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Palette className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                Color: {COLOR_NAMES[shirtColor] || shirtColor}
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {Object.entries(currentShirt.colors).map(([color, colorData]) => (
                  <button
                    key={color}
                    onClick={() => setShirtColor(color)}
                    className={`w-10 md:w-12 h-10 md:h-12 rounded-full border-2 transition-all ${
                      shirtColor === color
                        ? 'border-primary ring-4 ring-primary/30 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: colorData.hex }}
                    aria-label={`Seleccionar color: ${COLOR_NAMES[color] || color}`}
                    aria-pressed={shirtColor === color}
                    title={COLOR_NAMES[color] || color}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6">
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Talla</h3>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 md:px-5 py-1 md:py-2 rounded-lg border font-medium transition-all text-xs md:text-sm ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                    aria-pressed={selectedSize === size}
                    aria-label={`Seleccionar talla: ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Designs */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6">
              <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Grid3X3 className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                Diseños Disponibles
              </h3>

              <div className="relative mb-3 md:mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, código o etiqueta..."
                  value={searchDesign}
                  onChange={(e) => setSearchDesign(e.target.value)}
                  className="pl-10 text-xs md:text-sm h-8 md:h-10"
                  aria-label="Buscar diseños por nombre, código o referencia"
                />
              </div>

              <div
                className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 max-h-60 sm:max-h-64 md:max-h-80 overflow-y-auto"
                role="region"
                aria-label="Galería de diseños disponibles"
              >
                {filteredDesigns.length > 0 ? (
                  filteredDesigns.map(design => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`aspect-square rounded-lg md:rounded-xl border p-1 md:p-2 transition-all ${
                        selectedDesign.id === design.id
                          ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-pressed={selectedDesign.id === design.id}
                      aria-label={`Seleccionar diseño: ${design.name}`}
                      title={`${design.name} (${design.code})`}
                    >
                      <img
                        src={design.img}
                        alt={design.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="mt-1 text-[10px] text-center font-mono text-muted-foreground truncate">
                        {design.code}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 md:py-8 text-muted-foreground text-xs md:text-sm">
                    No se encontraron diseños
                  </div>
                )}
              </div>

              {selectedDesign.id !== 0 && (
                <div className="mt-3 md:mt-4 flex flex-wrap gap-1">
                  {selectedDesign.referencias.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Designer;
