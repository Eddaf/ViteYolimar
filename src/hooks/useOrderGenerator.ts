/**
 * Hook para generar pedido - PDF primero, luego WhatsApp
 */

import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { 
  generateOrderCode, 
  generateOrderPDF, 
  generateWhatsAppMessage, 
  getWhatsAppUrl, 
  ClientInfo, 
  OrderSummary 
} from '@/utils/orderGenerator';
// import { sendOrderNotificationToSeller } from '@/utils/emailSender'; // Descomentar si existe

interface UseOrderGeneratorReturn {
  isGenerating: boolean;
  orderCode: string | null;
  generateOrder: (clientInfo: ClientInfo) => Promise<{ 
    pdfFile: string; 
    whatsappUrl: string; 
    message: string;
  }>;
  resetOrder: () => void;
}

export const useOrderGenerator = (): UseOrderGeneratorReturn => {
  const { items, totalItems, getItemTotal } = useCart();
  const [isGenerating, setIsGenerating] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const calculateTotals = useCallback(() => {
    let subtotal = 0, discount = 0;
    items.forEach(item => {
      const total = getItemTotal(item);
      subtotal += item.price * item.quantity;
      discount += (item.price * item.quantity) - total;
    });
    return { subtotal, discount, total: subtotal - discount };
  }, [items, getItemTotal]);

  const generateOrder = useCallback(async (clientInfo: ClientInfo) => {
    if (items.length === 0) throw new Error('Carrito vacío');
    
    setIsGenerating(true);
    try {
      // Paso 1: Generar código de pedido
      const code = generateOrderCode();
      setOrderCode(code);
      
      // Paso 2: Calcular totales
      const { subtotal, discount, total } = calculateTotals();
      
      // Paso 3: Crear resumen del pedido
      const summary: OrderSummary = { 
        orderCode: code, 
        items, 
        totalItems, 
        subtotal, 
        totalDiscount: discount, 
        totalPrice: total, 
        clientInfo 
      };
      
      console.log('🚀 Generando PDF...');
      console.log('Items en carrito:', items.length);
      console.log('ClientInfo:', clientInfo);
      
      // Paso 4: Generar y descargar PDF (esto descarga automáticamente)
      const pdfFile = await generateOrderPDF(summary);
      
      console.log('✅ PDF descargado:', pdfFile);
      
      // Paso 5: Generar mensaje de WhatsApp
      const message = generateWhatsAppMessage(summary);
      const whatsappUrl = getWhatsAppUrl(message);
      
      // NOTA: El WhatsApp se abre desde CartDrawer después de que el PDF termine de descargarse
      // Esto se hace así para que el usuario pueda ver que el PDF se descargó primero
      
      // Si descomentas esto, enviará email al vendedor:
      // await sendOrderNotificationToSeller(summary);
      
      console.log('✅ Pedido generado correctamente');
      console.log('📱 WhatsApp URL listo para abrir');
      
      return { pdfFile, whatsappUrl, message };
    } finally {
      setIsGenerating(false);
    }
  }, [items, totalItems, calculateTotals]);

  return { 
    isGenerating, 
    orderCode, 
    generateOrder, 
    resetOrder: () => setOrderCode(null) 
  };
};

export default useOrderGenerator;
