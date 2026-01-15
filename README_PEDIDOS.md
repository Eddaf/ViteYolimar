🎨 Sistema de Pedidos YOLIMAR

📋 Descripción General

Sistema completo para gestión de pedidos que genera:





PDF Visual para producción (con códigos, imágenes, tablas)



WhatsApp estructurado para comunicación directa



Emails de confirmación (opcional)



🚀 Flujo de Pedido

1. Cliente agrega productos al carrito
2. Clic en "Generar Pedido"
3. Completa formulario (nombre, teléfono, email)
4. ✅ Se descarga PDF automáticamente
5. ✅ Se abre WhatsApp con mensaje listo
6. ✅ Cliente envía (tú recibes el mensaje)
7. ✅ Emails enviados (si EmailJS está configurado)




📁 Estructura de Archivos

src/
├── components/
│   ├── CartDrawer.tsx          # Carrito con botón de pedido
│   └── ClientInfoForm.tsx      # Formulario de datos del cliente
├── contexts/
│   └── CartContext.tsx         # Gestión del carrito
├── data/
│   ├── config.ts               # Configuración de precios
│   └── designs.ts              # Base de datos de diseños
├── hooks/
│   └── useOrderGenerator.ts    # Hook para generar pedidos
├── utils/
│   ├── orderGenerator.ts       # Generador de PDF y WhatsApp
│   └── emailSender.ts          # Envío de emails
└── App.tsx                     # Componente principal




📄 Contenido del PDF Generado

┌─────────────────────────────────────────────────────────┐
│                    YOLIMAR                              │
│            PEDIDO DE PRODUCCIÓN                         │
├─────────────────────────────────────────────────────────┤
│ Pedido #: PED-20260113-1430-001                        │
│ Fecha: 13/01/2026 - 14:30                              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ CÓDIGO    │ DESCRIPCIÓN      │ COLOR/TALLA │ CANT  │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ EST-013   │ Polera Personal. │ Blanco/M   │ 3     │ │
│ │ EST-012   │ Polera Personal. │ Negro/XL   │ 5     │ │
│ │ CAT-1001  │ Polera Básica    │ Rojo/S     │ 2     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ RESUMEN FINANCIERO                                     │
│ Subtotal: Bs. 650.00                                   │
│ Descuento: Bs. 13.33                                   │
│ ─────────────────                                      │
│ TOTAL A COBRAR: Bs. 636.67                             │
└─────────────────────────────────────────────────────────┘




📱 Mensaje de WhatsApp

🛒 *NUEVO PEDIDO - YOLIMAR*

*PEDIDO #: PED-20260113-1430-001*
📅 13/01/2026 - 14:30

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DEL CLIENTE*
━━━━━━━━━━━━━━━━━━━━━━━━
📝 Nombre: Juan Pérez
📱 Teléfono: 70123456

━━━━━━━━━━━━━━━━━━━━━━━━
📋 *RESUMEN DE PRODUCTOS*
━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Polera Personalizada (EST-013)
   📍 Blanco/M | x3 | Bs. 190

2️⃣ Polera Personalizada (EST-012)
   📍 Negro/XL | x5 | Bs. 317

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *TOTALES*
━━━━━━━━━━━━━━━━━━━━━━━━
📦 Total prendas: 8
💵 Subtotal: Bs. 520
🏷️ Descuentos: Bs. 13

*TOTAL A PAGAR: Bs. 507*




📧 Configuración de Emails (Opcional)

Paso 1: Crear cuenta en EmailJS





Ve a https://www.emailjs.com/



Crea una cuenta gratuita



Verifica tu email

Paso 2: Configurar Servicio de Email





En EmailJS, ve a Email Services



Agrega tu servicio de email (Gmail, Outlook, etc.)



Copia el Service ID

Paso 3: Crear Templates de Email

Template 1: Confirmación al cliente

Asunto: Confirmación de Pedido #{order_code}

Hola {to_name},

Tu pedido {order_code} ha sido recibido correctamente.

📦 Total prendas: {total_items}
💵 Total a pagar: Bs. {total_price}

Te contactaremos pronto para confirmar los detalles de pago y entrega.

Saludos,
{company_name}
{company_phone}


Template 2: Notificación al vendedor

Asunto: Nuevo Pedido #{order_code}

NUEVO PEDIDO RECIBIDO

📋 INFORMACIÓN:
- Pedido: {order_code}
- Fecha: {order_date}
- Total: Bs. {total_price}
- Prendas: {total_items}

👤 CLIENTE:
- Nombre: {client_name}
- Teléfono: {client_phone}
- Email: {client_email}
- Dirección: {client_address}

📦 PRODUCTOS:
{items_list}

---
Generado por {company_name}
{company_website}


Paso 4: Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto:

VITE_EMAILJS_SERVICE_ID=service_xxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxx
VITE_EMAILJS_PUBLIC_KEY=public_xxxxxxxxx




⚙️ Configuración de la Empresa

Edita src/utils/orderGenerator.ts:

export const COMPANY_CONFIG = {
  name: 'YOLIMAR',
  slogan: 'Poleras Personalizadas de Calidad',
  phone: '59176319999',  // ← Tu número de WhatsApp
  email: 'tu@email.com',
  website: 'www.tusitio.com'
};




📊 Descuentos Configurados

Catálogo (Poleras básicas)





Mínimo: 3 prendas



Descuento: -1.67 Bs por prenda



Ejemplo: 3 poleras = -5 Bs total

Diseños Personalizados





Mínimo: 12 prendas personalizadas (sumando todos los diseños)



Descuento: -1.67 Bs por prenda



Ejemplo: 12 poleras personalizadas = -20 Bs total



🔧 Personalización

Colores del PDF

Edita src/utils/orderGenerator.ts:

const primaryColor = [31, 78, 121] as [number, number, number];  // #1F4E79
const accentColor = [220, 38, 38] as [number, number, number];   // #dc2626


Formato del Código de Pedido

Edita generateOrderCode():

export const generateOrderCode = (): string => {
  // Formato actual: PED-YYYYMMDD-HHMM-XXX
  // Puedes cambiarlo a: ORD-001, YOL-0001, etc.
};




📦 Dependencias Instaladas

{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.1",
  "html2canvas": "^1.4.1",
  "emailjs-com": "^3.2.0"
}




🐛 Solución de Problemas

El PDF no se descarga





Verifica que el navegador permita descargas automáticas



Revisa la consola para errores de jsPDF

El email no se envía





Verifica las credenciales de EmailJS en .env



Revisa la consola para errores



Los emails son opcionales, el pedido sigue funcionando

WhatsApp no se abre





Verifica que el número esté en formato internacional (+591...)



El mensaje se puede copiar manualmente



📄 Licencia

Desarrollado para YOLIMAR