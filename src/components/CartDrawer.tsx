import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, FileText, Tag, Info, Download, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { COLOR_MAP, COLOR_NAMES } from '@/data/colors';
import { getPriceWithDiscount, getPriceWithDesignDiscountV2 } from '@/data/config';
import ClientInfoForm from './ClientInfoForm';
import { useOrderGenerator } from '@/hooks/useOrderGenerator';
import { ClientInfo } from '@/utils/orderGenerator';

const CartDrawer: React.FC = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    totalItems, 
    totalPrice, 
    clearCart, 
    getItemPrice, 
    getItemTotal,
    totalCustomItems
  } = useCart();

  const [showClientForm, setShowClientForm] = useState(false);
  const { isGenerating, generateOrder } = useOrderGenerator();

  if (!isOpen) return null;

  // ✅ NUEVA FUNCIÓN: Obtiene info de descuento considerando total de personalizados
  const getDiscountInfo = (item: any) => {
    if (item.isCustom && totalCustomItems > 0) {
      return getPriceWithDesignDiscountV2(
        item.size,
        item.quantity,
        totalCustomItems,
        item.price
      );
    }
    return getPriceWithDiscount(
      item.type,
      item.size,
      item.quantity,
      item.isCustom || false
    );
  };

  const handleGenerateOrder = async (clientInfo: ClientInfo) => {
    try {
      console.log('📦 Generando pedido para:', clientInfo.name);
      
      // Paso 1: Generar y descargar PDF (esto descarga automáticamente)
      const { whatsappUrl, pdfFile } = await generateOrder(clientInfo);
      
      console.log('✅ PDF descargado:', pdfFile);
      console.log('📱 Abriendo WhatsApp...');
      
      // Paso 2: Cerrar modal y carrito
      setShowClientForm(false);
      closeCart();
      
      // Paso 3: Abrir WhatsApp después de un breve delay para que termine la descarga del PDF
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
    } catch (error) {
      console.error('Error generando pedido:', error);
      alert('Error al generar el pedido. Por favor intenta nuevamente.');
    }
  };

  const handleWhatsAppOrder = () => {
    setShowClientForm(true);
  };
  
  // ✅ NUEVO: Calcular progreso para descuento de personalizados
  const customDiscountThreshold = 12;
  const remainingForDiscount = Math.max(0, customDiscountThreshold - totalCustomItems);
  const progressPercent = Math.min(100, (totalCustomItems / customDiscountThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Mi Carrito</h2>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>{totalItems}</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="w-5 h-5" />
          </Button>
          
        </div>
          
        {/* ✅ NUEVO: Barra de progreso de descuento */}
        {totalCustomItems > 0 && totalCustomItems < customDiscountThreshold && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mx-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-medium text-primary">
                🎨 Agrega {remainingForDiscount} prenda(s) más para descuento
              </span>
            </div>
            <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">
                {totalCustomItems} personalizadas
              </span>
              <span className="text-[10px] text-primary font-medium">
                meta: {customDiscountThreshold}
              </span>
            </div>
          </div>
        )}
        
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button variant="link" onClick={closeCart} className="mt-2">
                Explorar productos
              </Button>
            </div>
          ) : (
            items.map(item => {
              const priceInfo = getDiscountInfo(item);
              const itemUnitPrice = getItemPrice(item);
              const itemTotal = getItemTotal(item);

              return (
                <div key={item.id} className="flex gap-3 bg-muted/30 rounded-xl p-3">
                  {/* Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: COLOR_MAP[item.color] || '#ccc' }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {COLOR_NAMES[item.color] || item.color} / {item.size}
                          </span>
                        </div>
                        {item.isCustom && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-custom inline-block">
                              🎨 {item.designName}
                            </span>
                            {item.designCode && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-mono rounded">
                                <Tag className="w-2.5 h-2.5" />
                                {item.designCode}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        {priceInfo.hasDiscount && (
                          <div className="text-xs text-muted-foreground line-through">
                            Bs. {priceInfo.basePrice}
                          </div>
                        )}
                        <span className="font-bold text-primary">
                          Bs. {itemTotal}
                        </span>
                        {priceInfo.hasDiscount && (
                          <div className="text-xs text-success">
                            -Bs. {priceInfo.totalDiscount} ({priceInfo.discountPercentage}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3 bg-background">
            
            {/* ✅ NUEVO: Descuento aplicado */}
            {totalCustomItems >= customDiscountThreshold && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 text-xs text-primary">
                <p className="font-medium">🎨 ¡Descuento por 12+ prendas personalizado aplicado!</p>
              </div>
            )}

            {/* Resumen de descuentos del catálogo */}
            {items.some(item => {
              const priceInfo = getDiscountInfo(item);
              return priceInfo.hasDiscount && !item.isCustom;
            }) && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-2 text-xs text-success">
                <p className="font-medium">🎉 Descuentos aplicados</p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total</span>
                {totalCustomItems >= customDiscountThreshold && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    ✓ Descuento aplicado
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold">Bs. {totalPrice}</span>
            </div>
            
            {/* Botón de generar pedido */}
            <Button 
              className="w-full gap-2 h-12 text-base bg-primary hover:bg-primary/90"
              onClick={handleWhatsAppOrder}
            >
              <FileText className="w-5 h-5" />
              Generar Pedido
            </Button>
            
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Download className="w-3 h-3" />
              Se descargará el PDF y luego enviarás por WhatsApp
            </p>
            
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </div>
        )}
      </div>

      {/* Modal de información del cliente */}
      <ClientInfoForm
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        onSubmit={handleGenerateOrder}
        isGenerating={isGenerating}
      />
    </>
  );
};

export default CartDrawer;
