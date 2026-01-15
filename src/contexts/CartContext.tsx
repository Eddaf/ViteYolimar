import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { getPriceWithDiscount, getPriceWithDesignDiscountV2 } from '@/data/config';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  type: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  isCustom?: boolean;
  designId?: number;
  designCode?: string;
  designName?: string;
  shirtType?: string;
  previewImage?: string;
  designPosition?: 'left' | 'center' | 'right';
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalCustomItems: number; // ✅ NUEVO: Total de prendas personalizadas
  getItemPrice: (item: CartItem) => number;
  getItemTotal: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  // ✅ NUEVO: Calcular total de items personalizados en el carrito
  const totalCustomItems = useMemo(() => {
    return items
      .filter(item => item.isCustom)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // ✅ NUEVO: Calcula precio unitario con descuento considerando total de personalizados
  const getItemPrice = useCallback((item: CartItem): number => {
    if (item.isCustom && totalCustomItems > 0) {
      // Usar la nueva función V2 que considera el total de personalizados
      const priceInfo = getPriceWithDesignDiscountV2(
        item.size,
        item.quantity,
        totalCustomItems,
        item.price
      );
      return priceInfo.unitPrice;
    }
    
    const priceInfo = getPriceWithDiscount(
      item.type,
      item.size,
      item.quantity,
      item.isCustom || false
    );
    return priceInfo.unitPrice;
  }, [totalCustomItems]);

  // ✅ NUEVO: Calcula precio total con descuento considerando total de personalizados
  const getItemTotal = useCallback((item: CartItem): number => {
    const unitPrice = getItemPrice(item);
    return unitPrice * item.quantity;
  }, [getItemPrice]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.productId}-${newItem.color}-${newItem.size}-${newItem.isCustom ? newItem.designId : 'catalog'}`;
    
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id }];
    });
    
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Recalcular totales usando getItemTotal que ya tiene la lógica correcta
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  }, [items, getItemTotal]);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      totalCustomItems, // ✅ NUEVO: Exportar al contexto
      getItemPrice,
      getItemTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
