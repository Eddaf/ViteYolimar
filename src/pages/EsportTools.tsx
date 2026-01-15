import React, { useState } from 'react';
import { Download, Image, FileText, FileSpreadsheet, Loader2, Edit3, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATALOG_PRODUCTS, getColorsFromProduct, getSizesFromProduct } from '@/data/products';

// Configuración del banner - Colores y diseños del proyecto
const BANNER_CONFIG = {
  title: "Ropa de Calidad y Estilo Único",
  subtitle: "Poleras, blusas, sacks y soleras con diseños exclusivos",
  productsToShow: 8,
  showColors: true,
  showDesigns: false, // No hay diseños en tu estructura actual
  promoText: "¡Envíos a todo Bolivia!",
  secondaryPromo: "Calidad Garantizada",
  whatsappNumber: "+591 76319999",
  location: "Santa Cruz, Bolivia"
};

// Colores disponibles en el proyecto (extraídos de los productos)
const COLORS_MAP: Record<string, string> = {
  'blanco': '#f3f4f6',
  'negro': '#1f2937',
  'rojo': '#ef4444',
  'azul': '#3b82f6',
  'verde': '#22c55e',
  'amarillo': '#eab308',
  'rosa': '#ec4899',
  'morado': '#a855f7',
  'naranja': '#f97316',
  'gris': '#6b7280',
  'celeste': '#7dd3fc',
  'lila': '#c4b5fd'
};

// Iconos para cada tipo de producto
const TYPE_ICONS: Record<string, string> = {
  'polera': '👕',
  'saco': '🧥',
  'blusa': '👚',
  'solera': '👗'
};

// Nombres amigables para tipos
const TYPE_NAMES: Record<string, string> = {
  'polera': 'Poleras',
  'saco': 'Sacos',
  'blusa': 'Blusas',
  'solera': 'Soleras'
};

const ExportTools: React.FC = () => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'banner' | 'catalog' | 'excel'>('banner');

  const exportItems = [
    {
      id: 'banner',
      name: 'Exportar Banner',
      type: 'banner',
      description: 'Genera un banner publicitario con imágenes de productos',
      icon: <Image className="w-6 h-6" />
    },
    {
      id: 'catalog',
      name: 'Exportar Catálogo',
      type: 'catalog',
      description: 'Genera un catálogo completo con todos los productos',
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'excel',
      name: 'Exportar Excel',
      type: 'excel',
      description: 'Exporta todos los productos a formato Excel',
      icon: <FileSpreadsheet className="w-6 h-6" />
    }
  ];

  // Extraer todos los colores únicos del catálogo
  const allColors = React.useMemo(() => {
    const colors = new Set<string>();
    CATALOG_PRODUCTS.forEach(product => {
      getColorsFromProduct(product).forEach(color => colors.add(color));
    });
    return Array.from(colors);
  }, []);

  // Generar HTML del Banner con imágenes del catálogo
  const generateBannerHTML = (): string => {
    const featuredProducts = CATALOG_PRODUCTS.slice(0, BANNER_CONFIG.productsToShow);
    const productTypes = [...new Set(CATALOG_PRODUCTS.map(p => p.type))];

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YOLIMAR - ${BANNER_CONFIG.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#148577',
            primarylight: '#0d9488',
            primarydark: '#115e59',
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .product-card:hover { transform: translateY(-4px); }
  </style>
</head>
<body class="bg-gray-50">
  <!-- Banner Principal -->
  <div class="relative bg-gradient-to-br from-primary via-primarylight to-primarydark text-white overflow-hidden">
    <!-- Patrón decorativo -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Texto del Banner -->
        <div>
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span class="text-4xl font-black">Y</span>
            </div>
            <div>
              <span class="text-3xl font-black">YOLIMAR</span>
              <p class="text-sm opacity-80">Ropa de Calidad</p>
            </div>
          </div>
          
          <!-- Título -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            ${BANNER_CONFIG.title}
          </h1>
          <p class="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
            ${BANNER_CONFIG.subtitle}
          </p>
          
          <!-- Badges de características -->
          <div class="flex flex-wrap gap-3 mb-8">
            <span class="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              ${BANNER_CONFIG.promoText}
            </span>
            <span class="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              ${BANNER_CONFIG.secondaryPromo}
            </span>
            <span class="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              50% Anticipo
            </span>
          </div>
          
          <!-- Información de contacto -->
          <div class="space-y-2">
            <a href="https://wa.me/${BANNER_CONFIG.whatsappNumber.replace('+591 ', '')}" class="flex items-center gap-3 bg-green-500 hover:bg-green-600 transition-colors px-6 py-3 rounded-full font-semibold inline-flex">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ${BANNER_CONFIG.whatsappNumber}
            </a>
            <p class="text-sm opacity-75">📍 ${BANNER_CONFIG.location}</p>
          </div>
        </div>
        
        <!-- Productos Destacados -->
        <div class="hidden md:grid grid-cols-4 gap-4">
          ${featuredProducts.map((product) => `
            <div class="bg-white/10 backdrop-blur rounded-2xl p-3 product-card transition-all duration-300 cursor-pointer hover:bg-white/20">
              <div class="aspect-square bg-white rounded-xl p-3 mb-2 flex items-center justify-center">
                <img src="${product.image}" alt="${product.name}" class="max-h-24 object-contain" onerror="this.src='https://placehold.co/100x100/e2e8f0/148577?text=${product.code}'">
              </div>
              <p class="text-xs font-medium text-center line-clamp-2">${product.name}</p>
              <p class="text-xs text-center opacity-75">${TYPE_NAMES[product.type] || product.type}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Sección de Categorías -->
  <div class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-center mb-8">Nuestra Variedad</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${productTypes.map(type => `
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div class="w-12 h-12 bg-primary rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span class="text-2xl">${TYPE_ICONS[type] || '👕'}</span>
            </div>
            <p class="font-semibold">${TYPE_NAMES[type] || type}</p>
            <p class="text-sm text-muted-foreground">${CATALOG_PRODUCTS.filter(p => p.type === type).length} productos</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Sección de Colores -->
  ${BANNER_CONFIG.showColors ? `
  <div class="bg-gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-center mb-8">Colores Disponibles</h2>
      <div class="flex flex-wrap justify-center gap-4">
        ${allColors.slice(0, 12).map(color => `
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-full shadow-lg" style="background-color: ${COLORS_MAP[color] || '#6b7280'};"></div>
            <span class="text-xs text-muted-foreground capitalize">${color}</span>
          </div>
        `).join('')}
      </div>
      ${allColors.length > 12 ? `<p class="text-center text-muted-foreground mt-6">Y ${allColors.length - 12} colores más...</p>` : ''}
    </div>
  </div>
  ` : ''}

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-8">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div class="flex items-center justify-center gap-2 mb-4">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold">Y</span>
        </div>
        <span class="text-xl font-bold">YOLIMAR</span>
      </div>
      <p class="text-gray-400 mb-2">${BANNER_CONFIG.subtitle}</p>
      <p class="text-gray-500 text-sm">© 2025 YOLIMAR - ${BANNER_CONFIG.location}</p>
    </div>
  </footer>
</body>
</html>`;
  };

  // Generar HTML del Catálogo completo
  const generateCatalogHTML = (): string => {
    const categories = [...new Set(CATALOG_PRODUCTS.map(p => p.type))];
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo YOLIMAR</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#148577',
            primaryforeground: '#ffffff'
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
    @media print {
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body class="bg-gray-100 font-sans">
  <!-- Portada -->
  <div class="bg-gradient-to-br from-primary to-primary/80 text-white py-16 md:py-24 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <div class="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span class="text-5xl font-black">Y</span>
      </div>
      <h1 class="text-5xl md:text-7xl font-black mb-4">YOLIMAR</h1>
      <p class="text-2xl md:text-3xl opacity-90 mb-8">Catálogo de Productos</p>
      <div class="flex flex-wrap justify-center gap-4 text-lg">
        ${categories.map(type => `<span class="bg-white/20 px-4 py-2 rounded-full">${TYPE_ICONS[type]} ${TYPE_NAMES[type]}</span>`).join('')}
      </div>
      <div class="mt-8 text-xl font-semibold">
        <p>📱 WhatsApp: ${BANNER_CONFIG.whatsappNumber}</p>
        <p>📍 ${BANNER_CONFIG.location}</p>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-4 py-12">
    <!-- Resumen -->
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-bold mb-6">Información del Catálogo</h2>
      <div class="grid md:grid-cols-4 gap-6">
        <div class="text-center">
          <p class="text-4xl font-black text-primary">${CATALOG_PRODUCTS.length}</p>
          <p class="text-gray-600">Productos</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-black text-primary">${categories.length}</p>
          <p class="text-gray-600">Categorías</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-black text-primary">${CATALOG_PRODUCTS.reduce((sum, p) => sum + p.variants.length, 0)}</p>
          <p class="text-gray-600">Variantes</p>
        </div>
        <div class="text-center">
          <p class="text-4xl font-black text-primary">${allColors.length}</p>
          <p class="text-gray-600">Colores</p>
        </div>
      </div>
    </div>

    <!-- Productos por Categoría -->
    ${categories.map((category, index) => `
      <div class="mb-12 ${index > 0 ? 'page-break' : ''}">
        <h2 class="text-3xl font-black text-gray-800 mb-6 capitalize flex items-center gap-3">
          <span class="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2">
            ${TYPE_ICONS[category]} ${TYPE_NAMES[category]}
          </span>
          <span class="text-gray-400 text-lg font-normal">(${CATALOG_PRODUCTS.filter(p => p.type === category).length} productos)</span>
        </h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${CATALOG_PRODUCTS.filter(p => p.type === category).map(product => `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div class="bg-gray-100 p-6 flex items-center justify-center h-48">
                <img src="${product.image}" alt="${product.name}" class="max-h-40 object-contain" onerror="this.src='https://placehold.co/200x200/e2e8f0/148577?text=${product.code}'">
              </div>
              <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-bold">${product.name}</h3>
                  <span class="text-xs bg-gray-200 px-2 py-1 rounded">${product.code}</span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                <div class="flex flex-wrap gap-1 mb-4">
                  <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">${product.material}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm text-gray-500">Stock total</p>
                    <p class="text-lg font-bold ${product.variants.reduce((s, v) => s + v.stock, 0) > 10 ? 'text-green-600' : product.variants.reduce((s, v) => s + v.stock, 0) > 0 ? 'text-yellow-600' : 'text-red-600'}">
                      ${product.variants.reduce((s, v) => s + v.stock, 0)}
                    </p>
                  </div>
                  <a href="https://wa.me/${BANNER_CONFIG.whatsappNumber.replace('+591 ', '')}" class="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                    Pedir por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}

    <!-- Información de contacto -->
    <div class="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl shadow-lg p-8 text-center no-print">
      <h2 class="text-2xl font-bold mb-4">¿Cómo ordenar?</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div>
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl font-bold">1</span>
          </div>
          <p class="font-medium">Elige tus productos</p>
        </div>
        <div>
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl font-bold">2</span>
          </div>
          <p class="font-medium">Paga el 50% de anticipo</p>
        </div>
        <div>
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl font-bold">3</span>
          </div>
          <p class="font-medium">Recibe y paga el saldo</p>
        </div>
      </div>
      <div class="mt-8 text-xl font-semibold">
        <p>📱 WhatsApp: ${BANNER_CONFIG.whatsappNumber}</p>
        <p>📧 info@yolimar.com</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-8 no-print">
    <div class="container mx-auto px-4 text-center">
      <div class="flex items-center justify-center gap-2 mb-4">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold">Y</span>
        </div>
        <span class="text-xl font-bold">YOLIMAR</span>
      </div>
      <p class="text-gray-400">© 2025 YOLIMAR - ${BANNER_CONFIG.location}</p>
      <p class="text-gray-500 text-sm mt-2">Catálogo generado el ${new Date().toLocaleDateString('es-BO')}</p>
    </div>
  </footer>
</body>
</html>`;
  };

  const handleExport = async (type: string) => {
    setExporting(type);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let content: string;
      let filename: string;
      let mimeType: string;
      
      switch (type) {
        case 'banner':
          content = generateBannerHTML();
          filename = 'yolimar-banner.html';
          mimeType = 'text/html';
          break;
        case 'catalog':
          content = generateCatalogHTML();
          filename = 'yolimar-catalogo.html';
          mimeType = 'text/html';
          break;
        case 'excel':
          content = generateExcelCSV();
          filename = 'yolimar-productos.csv';
          mimeType = 'text/csv';
          break;
        default:
          return;
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting(null);
    }
  };

  const generateExcelCSV = (): string => {
    const headers = ['Código', 'Nombre', 'Tipo', 'Descripción', 'Material', 'Color', 'Talla', 'Stock', 'Precio', 'SKU'];
    const rows = CATALOG_PRODUCTS.flatMap(product => 
      product.variants.map(variant => [
        product.code,
        product.name,
        product.type,
        product.description,
        product.material,
        variant.color,
        variant.size,
        variant.stock,
        variant.price,
        variant.sku
      ])
    );
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Vista previa del banner
  const BannerPreview: React.FC = () => {
    const featuredProducts = CATALOG_PRODUCTS.slice(0, BANNER_CONFIG.productsToShow);
    
    return (
      <div className="space-y-6">
        {/* Banner Preview */}
        <div className="bg-gradient-to-br from-primary via-primarylight to-primarydark text-white rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-black">Y</span>
              </div>
              <div>
                <span className="text-2xl font-black">YOLIMAR</span>
                <p className="text-xs opacity-80">Ropa de Calidad</p>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              {BANNER_CONFIG.title}
            </h2>
            <p className="opacity-90 mb-4">{BANNER_CONFIG.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{BANNER_CONFIG.promoText}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{BANNER_CONFIG.secondaryPromo}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">50% Anticipo</span>
            </div>
          </div>
          
          {/* Products Grid Preview */}
          <div className="bg-white/10 p-4">
            <div className="grid grid-cols-4 gap-3">
              {featuredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg p-2 text-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full aspect-square object-contain mb-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/100x100/e2e8f0/148577?text=${product.code}`;
                    }}
                  />
                  <p className="text-xs line-clamp-1">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold mb-2">Colores</h3>
            <div className="flex flex-wrap gap-1">
              {allColors.slice(0, 8).map(color => (
                <div 
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: COLORS_MAP[color] || '#6b7280' }}
                  title={color}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{allColors.length} colores disponibles</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold mb-2">Categorías</h3>
            <div className="space-y-1">
              {[...new Set(CATALOG_PRODUCTS.map(p => p.type))].map(type => (
                <div key={type} className="flex justify-between text-sm">
                  <span>{TYPE_ICONS[type]} {TYPE_NAMES[type]}</span>
                  <span className="text-muted-foreground">{CATALOG_PRODUCTS.filter(p => p.type === type).length}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold mb-2">Estadísticas</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total productos</span>
                <span className="font-medium">{CATALOG_PRODUCTS.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total variantes</span>
                <span className="font-medium">{CATALOG_PRODUCTS.reduce((sum, p) => sum + p.variants.length, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock total</span>
                <span className="font-medium">{CATALOG_PRODUCTS.reduce((sum, p) => sum + p.variants.reduce((s, v) => s + v.stock, 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Herramientas de Exportación</h2>
          <p className="text-muted-foreground">Genera materiales promocionales con imágenes del catálogo</p>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewMode('banner')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            previewMode === 'banner' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Image className="w-4 h-4 inline mr-2" />
          Vista Previa Banner
        </button>
        <button
          onClick={() => setPreviewMode('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            previewMode === 'catalog' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Vista Previa Catálogo
        </button>
      </div>

      {/* Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {previewMode === 'banner' ? (
              <>
                <Edit3 className="w-5 h-5 text-primary" />
                Vista Previa del Banner
              </>
            ) : (
              <>
                <Palette className="w-5 h-5 text-primary" />
                Vista Previa del Catálogo
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewMode === 'banner' ? (
            <BannerPreview />
          ) : (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-center text-muted-foreground mb-4">
                El catálogo incluirá <strong>{CATALOG_PRODUCTS.length} productos</strong> organizados por categoría
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATALOG_PRODUCTS.slice(0, 8).map(product => (
                  <div key={product.id} className="bg-white rounded-lg p-3 text-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 mx-auto object-contain mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/100x100/e2e8f0/148577?text=${product.code}`;
                      }}
                    />
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{TYPE_NAMES[product.type] || product.type}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                +{CATALOG_PRODUCTS.length - 8} productos más...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <div className="grid md:grid-cols-3 gap-6">
        {exportItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                item.id === 'banner' ? 'bg-blue-100 text-blue-600' :
                item.id === 'catalog' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {item.icon}
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <Button 
                onClick={() => handleExport(item.id)}
                disabled={exporting !== null}
                className="w-full"
                variant={item.id === 'banner' ? 'default' : item.id === 'catalog' ? 'default' : 'outline'}
              >
                {exporting === item.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Config Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal">
            Información del catálogo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 text-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground">Total productos</p>
                <p className="font-medium">{CATALOG_PRODUCTS.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total variantes</p>
                <p className="font-medium">{CATALOG_PRODUCTS.reduce((sum, p) => sum + p.variants.length, 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Colores</p>
                <p className="font-medium">{allColors.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stock total</p>
                <p className="font-medium">{CATALOG_PRODUCTS.reduce((sum, p) => sum + p.variants.reduce((s, v) => s + v.stock, 0), 0)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportTools;
