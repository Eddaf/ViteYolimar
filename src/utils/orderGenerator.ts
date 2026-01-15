/**
 * UTILIDAD DE GENERACIÓN DE PEDIDOS - CON IMÁGENES
 */

import { COLOR_NAMES } from '@/data/colors';

// Configuración de la empresa
export const COMPANY_CONFIG = {
  name: 'YOLIMAR',
  slogan: 'Poleras Personalizadas de Calidad',
  phone: '59176319999',
  email: 'eddarosinaga@gmail.com',
  website: 'https://yolimartextil.netlify.app/'
};

// Generar código único de pedido
export const generateOrderCode = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `PED-${year}${month}${day}-${hours}${minutes}-${random}`;
};

// Interfaz para datos del cliente
export interface ClientInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

// Interfaz para resumen de pedido
export interface OrderSummary {
  orderCode: string;
  items: any[];
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  totalPrice: number;
  clientInfo?: ClientInfo;
}

// Colores para el PDF
const PRIMARY_COLOR: [number, number, number] = [31, 78, 121];
const ACCENT_COLOR: [number, number, number] = [220, 38, 38];
const TEXT_COLOR: [number, number, number] = [30, 30, 30];

// Cargar scripts desde CDN
const loadScripts = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf && (window as any).html2canvas) {
      resolve();
      return;
    }

    const scripts = [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', id: 'jspdf' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js', id: 'jspdf-autotable' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', id: 'html2canvas' }
    ];

    let loadedCount = 0;
    
    scripts.forEach(script => {
      const existing = document.getElementById(script.id);
      if (existing) {
        loadedCount++;
        if (loadedCount === scripts.length) resolve();
        return;
      }

      const scriptEl = document.createElement('script');
      scriptEl.id = script.id;
      scriptEl.src = script.src;
      scriptEl.async = false;
      scriptEl.onload = () => {
        loadedCount++;
        if (loadedCount === scripts.length) resolve();
      };
      scriptEl.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.head.appendChild(scriptEl);
    });
  });
};

// Generar imagen en miniatura de una polera
const generateThumbnail = async (item: any): Promise<string> => {
  return new Promise((resolve) => {
    // Crear canvas temporal
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve(item.image || '');
      return;
    }

    // Fondo con el color de la polera
    ctx.fillStyle = item.color || '#FFFFFF';
    ctx.fillRect(0, 0, 150, 150);

    // Dibujar la imagen si existe
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Mantener proporción
      const scale = Math.min(190 / img.width, 160 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (150 - w) / 2;
      const y = (150 - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(canvas.toDataURL('image/png'));
    img.src = item.image || '';
  });
};

/**
 * Genera PDF visual del pedido para producción - CON IMÁGENES
 */
export const generateOrderPDF = async (orderSummary: OrderSummary): Promise<string> => {
  // Cargar librerías desde CDN
  await loadScripts();

  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();
  const orderCode = orderSummary.orderCode;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-BO');
  const timeStr = now.toLocaleTimeString('es-BO');

  // ==================== ENCABEZADO ====================
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 220, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY_CONFIG.name, 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY_CONFIG.slogan, 20, 30);
  
  doc.setFontSize(10);
  doc.text(`${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`, 20, 38);

  // ==================== INFO PEDIDO ====================
  let yPos = 55;
  
  doc.setTextColor(...TEXT_COLOR);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PEDIDO DE PRODUCCION', 20, yPos);
  
  yPos += 8;
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pedido #: ${orderCode}`, 20, yPos);
  doc.text(`Fecha: ${dateStr} - ${timeStr}`, 120, yPos);
  
  yPos += 7;
  doc.text(`Total prendas: ${orderSummary.totalItems}`, 20, yPos);
  doc.text(`Total a cobrar: Bs. ${orderSummary.totalPrice.toFixed(2)}`, 120, yPos);
  
  // Info del cliente
  if (orderSummary.clientInfo) {
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${orderSummary.clientInfo.name}`, 20, yPos);
    yPos += 5;
    doc.text(`Telefono: ${orderSummary.clientInfo.phone}`, 20, yPos);
    if (orderSummary.clientInfo.email) {
      yPos += 5;
      doc.text(`Email: ${orderSummary.clientInfo.email}`, 20, yPos);
    }
    if (orderSummary.clientInfo.notes) {
      yPos += 5;
      doc.text(`Notas: ${orderSummary.clientInfo.notes}`, 20, yPos);
    }
  }

  // ==================== PRODUCTOS CON IMÁGENES ====================
  yPos += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCTOS', 20, yPos);
  yPos += 5;

  for (let i = 0; i < orderSummary.items.length; i++) {
    const item = orderSummary.items[i];
    
    // Verificar espacio para el siguiente producto
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const itemTotal = item.price * item.quantity;
    const itemCode = item.isCustom && item.designCode ? item.designCode : `CAT-${item.productId}`;
    const colorName = COLOR_NAMES[item.color] || item.color;

    // Fondo del producto
    doc.setFillColor(245, 245, 245);
    doc.rect(20, yPos, 170, 35, 'F');
    
    // Imagen (si existe)
    if (item.image) {
      try {
        const imgData = await generateThumbnail(item);
        doc.addImage(imgData, 'PNG', 22, yPos + 2, 30, 30);
      } catch (e) {
        // Si falla la imagen, dibujar un rectángulo
        doc.setFillColor(200, 200, 200);
        doc.rect(22, yPos + 2, 28, 28, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Sin imagen', 25, yPos + 17);
      }
    } else {
      doc.setFillColor(200, 200, 200);
      doc.rect(22, yPos + 2, 28, 28, 'F');
    }

    // Información del producto
    doc.setTextColor(...TEXT_COLOR);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}. ${item.name}`, 58, yPos + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Codigo: ${itemCode}`, 58, yPos + 15);
    doc.text(`Color/Talla: ${colorName} / ${item.size}`, 58, yPos + 21);
    doc.text(`Cantidad: ${item.quantity}`, 58, yPos + 27);
    
    if (item.isCustom && item.designName) {
      doc.text(`Diseno: ${item.designName}`, 110, yPos + 15);
    }

    // Precio
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bs. ${itemTotal.toFixed(2)}`, 170, yPos + 25, { align: 'right' });

    yPos += 40;
  }

  // ==================== RESUMEN ====================
  yPos += 10;
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN FINANCIERO', 120, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('Subtotal:', 140, yPos + 6);
  doc.text(`Bs. ${orderSummary.subtotal.toFixed(2)}`, 190, yPos + 6, { align: 'right' });
  
  if (orderSummary.totalDiscount > 0) {
    doc.setTextColor(...ACCENT_COLOR);
    doc.text('Descuento:', 140, yPos + 12);
    doc.text(`-Bs. ${orderSummary.totalDiscount.toFixed(2)}`, 190, yPos + 12, { align: 'right' });
    doc.setTextColor(...TEXT_COLOR);
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL A COBRAR:', 140, yPos + 20);
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(140, yPos + 22, 50, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(`Bs. ${orderSummary.totalPrice.toFixed(2)}`, 190, yPos + 29, { align: 'right' });

  // ==================== PIE DE PÁGINA ====================
  doc.setTextColor(...TEXT_COLOR);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerText = `Generado: ${COMPANY_CONFIG.name} | ${dateStr} | ${orderCode}`;
  doc.text(footerText, 105, 285, { align: 'center' });

  // Guardar PDF
  const fileName = `${orderCode}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

/**
 * Genera mensaje de WhatsApp
 */
export const generateWhatsAppMessage = (orderSummary: OrderSummary): string => {
  const orderCode = orderSummary.orderCode;
  const now = new Date();
  let message = `🛒 *NUEVO PEDIDO - ${COMPANY_CONFIG.name}*\n\n`;
  message += `*PEDIDO #: ${orderCode}*\n`;
  message += `📅 ${now.toLocaleDateString('es-BO')} - ${now.toLocaleTimeString('es-BO')}\n\n`;

  if (orderSummary.clientInfo) {
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *DATOS DEL CLIENTE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📝 Nombre: ${orderSummary.clientInfo.name}\n`;
    message += `📱 Telefono: ${orderSummary.clientInfo.phone}\n`;
    if (orderSummary.clientInfo.email) {
      message += `📧 Email: ${orderSummary.clientInfo.email}\n`;
    }
    message += `\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *RESUMEN DE PRODUCTOS*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  orderSummary.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    const colorName = COLOR_NAMES[item.color] || item.color;
    const code = item.isCustom && item.designCode ? item.designCode : `CAT-${item.productId}`;
    
    message += `${index + 1}️⃣ *${item.name}* (${code})\n`;
    message += `   📍 ${colorName}/${item.size}`;
    if (item.isCustom && item.designPosition) {
      message += ` | ${item.designPosition}`;
    }
    message += ` | x${item.quantity}\n`;
    
    if (item.isCustom && item.designName) {
      message += `   🎨 ${item.designName}\n`;
    }
    
    message += `   💵 Bs. ${itemTotal.toFixed(2)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTALES*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 Total prendas: ${orderSummary.totalItems}\n`;
  message += `💵 Subtotal: Bs. ${orderSummary.subtotal.toFixed(2)}\n`;
  
  if (orderSummary.totalDiscount > 0) {
    message += `🏷️ Descuentos: Bs. ${orderSummary.totalDiscount.toFixed(2)}\n`;
  }
  
  message += `\n*TOTAL A PAGAR: Bs. ${orderSummary.totalPrice.toFixed(2)}*\n\n`;
  message += `📄 PDF con imagenes disponible para produccion`;

  return message;
};

/**
 * Genera URL de WhatsApp
 */
export const getWhatsAppUrl = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${COMPANY_CONFIG.phone}?text=${encodedMessage}`;
};
