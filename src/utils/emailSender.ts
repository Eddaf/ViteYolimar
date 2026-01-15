import { COMPANY_CONFIG, OrderSummary } from './orderGenerator';

export const generateSellerMailto = (orderSummary: OrderSummary): string => {
  const items = orderSummary.items.map((item, i) => {
    const code = item.isCustom && item.designCode ? item.designCode : `CAT-${item.productId}`;
    return `${i+1}. ${item.name} (${code}) - ${item.color}/${item.size} x${item.quantity} = Bs. ${(item.price * item.quantity).toFixed(2)}`;
  }).join('\n');
  
  const body = `NUEVO PEDIDO\n\nPEDIDO #: ${orderSummary.orderCode}\n\nCLIENTE:\nNombre: ${orderSummary.clientInfo?.name || 'N/A'}\nTelefono: ${orderSummary.clientInfo?.phone || 'N/A'}\nEmail: ${orderSummary.clientInfo?.email || 'N/A'}\n\nPRODUCTOS:\n${items}\n\nTOTAL: Bs. ${orderSummary.totalPrice.toFixed(2)}`;
  
  return `mailto:${COMPANY_CONFIG.email}?subject=NUEVO PEDIDO: ${orderSummary.orderCode}&body=${encodeURIComponent(body)}`;
};

export const sendOrderNotificationToSeller = async (orderSummary: OrderSummary): Promise<boolean> => {
  window.open(generateSellerMailto(orderSummary), '_blank');
  return true;
};

export const sendConfirmationToClient = async (_orderSummary: OrderSummary): Promise<boolean> => { return true; };