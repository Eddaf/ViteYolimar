import React, { useState, useCallback, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Download, FileText, HelpCircle, ChevronRight, Image, FileSpreadsheet, Loader2, Upload, Folder, FileImage, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CATALOG_PRODUCTS, getColorsFromProduct } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Configuración del banner
const BANNER_CONFIG = {
  title: "Ropa de Calidad y Estilo Único",
  subtitle: "Poleras, blusas, sacks y soleras con diseños exclusivos",
  productsToShow: 8,
  promoText: "¡Envíos a todo Bolivia!",
  secondaryPromo: "Calidad Garantizada",
  whatsappNumber: "+591 76319999",
  location: "Santa Cruz, Bolivia"
};

// Configuración de carpetas de imágenes
const IMAGE_FOLDERS: Record<string, { name: string; path: string; prefix: string; pattern: RegExp; nextNum: number; color: string; icon: string }> = {
  designs: {
    name: 'Diseños/Estampados',
    path: 'imagenes/Estampado/',
    prefix: 'EST_IMG',
    pattern: /EST_IMG(\d+)/i,
    nextNum: 14,
    color: 'bg-purple-100 text-purple-700',
    icon: '🎨'
  },
  blusas: {
    name: 'Blusas',
    path: 'imagenes/Blusas/',
    prefix: 'BLUSA',
    pattern: /BLUSA(\d+)/i,
    nextNum: 1,
    color: 'bg-pink-100 text-pink-700',
    icon: '👚'
  },
  polerasAlgodon: {
    name: 'Poleras Algodón',
    path: 'imagenes/PolerasAlgodon/',
    prefix: 'ALG',
    pattern: /ALG(\d+)/i,
    nextNum: 1,
    color: 'bg-cyan-100 text-cyan-700',
    icon: '👕'
  },
  polerasCuelloV: {
    name: 'Poleras Cuello V',
    path: 'imagenes/PolerasCuelloV/',
    prefix: 'CV',
    pattern: /CV(\d+)/i,
    nextNum: 1,
    color: 'bg-indigo-100 text-indigo-700',
    icon: '👕'
  },
  polerasEstampado: {
    name: 'Poleras Estampado',
    path: 'imagenes/PolerasEstampado/',
    prefix: 'ESTAMPADO',
    pattern: /ESTAMPADO(\d+)/i,
    nextNum: 1,
    color: 'bg-orange-100 text-orange-700',
    icon: '👕'
  },
  polerasPoliester: {
    name: 'Poleras Poliéster',
    path: 'imagenes/PolerasPoliester/',
    prefix: 'POL',
    pattern: /POL(\d+)/i,
    nextNum: 1,
    color: 'bg-blue-100 text-blue-700',
    icon: '👕'
  },
  polerasTop: {
    name: 'Poleras TOP',
    path: 'imagenes/PolerasTop/',
    prefix: 'TOP',
    pattern: /TOP(\d+)/i,
    nextNum: 1,
    color: 'bg-yellow-100 text-yellow-700',
    icon: '👕'
  },
  sacos: {
    name: 'Sacos',
    path: 'imagenes/Sacos/',
    prefix: 'SACO',
    pattern: /SACO(\d+)/i,
    nextNum: 1,
    color: 'bg-gray-100 text-gray-700',
    icon: '🧥'
  },
  solera: {
    name: 'Solera',
    path: 'imagenes/Solera/',
    prefix: 'SOLERA',
    pattern: /SOLERA(\d+)/i,
    nextNum: 1,
    color: 'bg-green-100 text-green-700',
    icon: '👗'
  }
};

// Generador del script de Node.js
const generateUploadScript = () => {
  return `/**
 * YOLIMAR - SCRIPT DE CARGA DE IMÁGENES
 * 
 * USO:
 *   1. Crea la carpeta "imagenes/pendientes/" en tu proyecto
 *   2. Coloca las imágenes a procesar ahí
 *   3. Ejecuta: node upload-images.js
 * 
 * ESTRUCTURA:
 *   tu-proyecto/
 *   ├── upload-images.js      ← Este script
 *   └── imagenes/
 *       ├── pendientes/       ← Imágenes aquí
 *       ├── Blusas/
 *       ├── PolerasAlgodon/
 *       ├── PolerasCuelloV/
 *       ├── PolerasEstampado/
 *       ├── PolerasPoliester/
 *       ├── PolerasTop/
 *       ├── Sacos/
 *       ├── Solera/
 *       └── Estampado/
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  basePath: path.join(__dirname, 'imagenes'),
  pendingFolder: 'pendientes',
  folders: {
    'Blusas': { prefix: 'BLUSA', pattern: /^(BLUSA|BLUSA-)/i },
    'PolerasAlgodon': { prefix: 'ALG', pattern: /^(ALG|ALG-)/i },
    'PolerasCuelloV': { prefix: 'CV', pattern: /^(CV|CV-)/i },
    'PolerasEstampado': { prefix: 'ESTAMPADO', pattern: /^(ESTAMPADO|ESTAMPADO-)/i },
    'PolerasPoliester': { prefix: 'POL', pattern: /^(POL|POL-)/i },
    'PolerasTop': { prefix: 'TOP', pattern: /^(TOP|TOP-)/i },
    'Sacos': { prefix: 'SACO', pattern: /^(SACO|SACO-)/i },
    'Solera': { prefix: 'SOLERA', pattern: /^(SOLERA|SOLERA-)/i },
  },
  estampariaFolder: 'Estampado',
  estampariaPrefix: 'EST_IMG'
};

const SUPPORTED = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

const getNextNum = (folder, prefix) => {
  if (!fs.existsSync(folder)) { fs.mkdirSync(folder, { recursive: true }); return 1; }
  let max = 0;
  fs.readdirSync(folder).forEach(f => {
    const m = f.match(new RegExp(\`\${prefix}(\\d+)\`, 'i'));
    if (m) max = Math.max(max, parseInt(m[1]));
  });
  return max + 1;
};

const detectType = (filename) => {
  const name = path.parse(filename).name.toLowerCase();
  for (const [folder, cfg] of Object.entries(CONFIG.folders)) {
    if (cfg.pattern.test(name)) return { folder, custom: false };
  }
  return { folder: CONFIG.estampariaFolder, custom: true };
};

const processImages = () => {
  const pending = path.join(CONFIG.basePath, CONFIG.pendingFolder);
  
  if (!fs.existsSync(pending)) {
    fs.mkdirSync(pending, { recursive: true });
    console.log('✅ Carpeta creada:', pending);
    console.log('   Coloca las imágenes ahí y vuelve a ejecutar.');
    return;
  }
  
  const files = fs.readdirSync(pending).filter(f => 
    SUPPORTED.includes(path.extname(f).toLowerCase())
  );
  
  if (files.length === 0) {
    console.log('⚠️  No hay imágenes en la carpeta "pendientes"');
    return;
  }
  
  console.log(\`📸 Procesando \${files.length} imagen(es)...\\n\`);
  
  const designs = [];
  
  files.forEach((file) => {
    const oldPath = path.join(pending, file);
    const { folder, custom } = detectType(file);
    const target = path.join(CONFIG.basePath, folder);
    const prefix = custom ? CONFIG.estampariaPrefix : CONFIG.folders[folder].prefix;
    const next = getNextNum(target, prefix);
    const ext = path.extname(file).toLowerCase();
    const newName = custom 
      ? \`\${prefix}\${next}\${ext}\`
      : \`\${prefix}\${String(next).padStart(3, '0')}\${ext}\`;
    
    fs.renameSync(oldPath, path.join(target, newName));
    console.log(\`✅ \${file} → \${folder}/\${newName}\`);
    
    if (custom) {
      const name = path.parse(file).name
        .replace(/[-_]/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      designs.push({
        id: next,
        code: \`\${prefix}\${String(next).padStart(3, '0')}\`,
        name,
        img: \`imagenes/\${folder}/\${newName}\`,
        referencias: ['Nuevo diseño', name]
      });
    }
  });
  
  console.log('\\n═══════════════════════════════════════════════');
  console.log('📝 CÓDIGO PARA AGREGAR A designs.ts:');
  console.log('═══════════════════════════════════════════════\\n');
  
  if (designs.length > 0) {
    console.log('// =========================================');
    console.log('// DISEÑOS AGREGADOS');
    console.log('// Fecha:', new Date().toLocaleDateString());
    console.log('// =========================================\\n');
    
    designs.forEach(d => {
      console.log(\`  { \`);
      console.log(\`    id: \${d.id},\`);
      console.log(\`    code: '\${d.code}',\`);
      console.log(\`    name: '\${d.name}',\`);
      console.log(\`    img: '\${d.img}',\`);
      console.log(\`    referencias: [\${d.referencias.map(r => \`'\${r}'\`).join(', ')}]\`);
      console.log(\`  },\`);
    });
  }
  
  console.log('\\n═══════════════════════════════════════════════');
  console.log('✅ Proceso completado!');
  console.log('═══════════════════════════════════════════════');
};

processImages();
`;
};

// Generar HTML del Banner
const generateBannerHTML = (): string => {
  const featuredProducts = CATALOG_PRODUCTS.slice(0, BANNER_CONFIG.productsToShow);
  const productTypes = [...new Set(CATALOG_PRODUCTS.map(p => p.type))];
  const TYPE_NAMES: Record<string, string> = { polera: 'Poleras', saco: 'Sacos', blusa: 'Blusas', solera: 'Soleras' };
  const TYPE_ICONS: Record<string, string> = { polera: '👕', saco: '🧥', blusa: '👚', solera: '👗' };

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
  </style>
</head>
<body class="bg-gray-50">
  <div class="relative bg-gradient-to-br from-primary via-primarylight to-primarydark text-white overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div class="flex items-center gap-3 mb-6">
            <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span class="text-4xl font-black">Y</span>
            </div>
            <div>
              <span class="text-3xl font-black">YOLIMAR</span>
              <p class="text-sm opacity-80">Ropa de Calidad</p>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">${BANNER_CONFIG.title}</h1>
          <p class="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">${BANNER_CONFIG.subtitle}</p>
          <a href="https://wa.me/${BANNER_CONFIG.whatsappNumber.replace('+591 ', '')}" class="flex items-center gap-3 bg-green-500 hover:bg-green-600 transition-colors px-6 py-3 rounded-full font-semibold inline-flex">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            ${BANNER_CONFIG.whatsappNumber}
          </a>
          <p class="text-sm opacity-75 mt-2">📍 ${BANNER_CONFIG.location}</p>
        </div>
        <div class="hidden md:grid grid-cols-4 gap-4">
          ${featuredProducts.map(product => `
            <div class="bg-white/10 backdrop-blur rounded-2xl p-3">
              <div class="aspect-square bg-white rounded-xl p-3 mb-2 flex items-center justify-center">
                <img src="${product.image}" alt="${product.name}" class="max-h-24 object-contain">
              </div>
              <p class="text-xs font-medium text-center line-clamp-2">${product.name}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  <footer class="bg-gray-900 text-white py-8 text-center">
    <p>© 2025 YOLIMAR - ${BANNER_CONFIG.location}</p>
  </footer>
</body>
</html>`;
};

// Generar HTML del Catálogo
const generateCatalogHTML = (): string => {
  const categories = [...new Set(CATALOG_PRODUCTS.map(p => p.type))];
  const TYPE_NAMES: Record<string, string> = { polera: 'Poleras', saco: 'Sacos', blusa: 'Blusas', solera: 'Soleras' };
  const TYPE_ICONS: Record<string, string> = { polera: '👕', saco: '🧥', blusa: '👚', solera: '👗' };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo YOLIMAR</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-100">
  <div class="bg-primary text-white py-16 text-center">
    <h1 class="text-5xl font-black">YOLIMAR</h1>
    <p class="text-2xl mt-2">Catálogo de Productos</p>
    <p class="mt-4">📱 ${BANNER_CONFIG.whatsappNumber} | 📍 ${BANNER_CONFIG.location}</p>
  </div>
  <div class="container mx-auto px-4 py-12">
    ${categories.map(cat => `
      <div class="mb-12">
        <h2 class="text-3xl font-bold mb-6 capitalize">${TYPE_ICONS[cat]} ${TYPE_NAMES[cat]}</h2>
        <div class="grid md:grid-cols-3 gap-6">
          ${CATALOG_PRODUCTS.filter(p => p.type === cat).map(p => `
            <div class="bg-white rounded-xl shadow p-4">
              <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-contain mb-4">
              <h3 class="font-bold">${p.name}</h3>
              <p class="text-sm text-gray-600">Stock: ${p.variants.reduce((s, v) => s + v.stock, 0)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
};

const generateExcelCSV = (): string => {
  const headers = ['Código', 'Nombre', 'Tipo', 'Color', 'Talla', 'Stock'];
  const rows = CATALOG_PRODUCTS.flatMap(p => p.variants.map(v => [p.code, p.name, p.type, v.color, v.size, v.stock]));
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

// ==================== COMPONENTE DE GESTIÓN DE IMÁGENES ====================

const ImageUploader: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('designs');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFolder = IMAGE_FOLDERS[selectedFolder];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => 
        ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes((f.name || '').toLowerCase().split('.').pop() || '')
      );
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateCode = () => {
    if (selectedFiles.length === 0) return;

    let code = `// =========================================\n`;
    code += `// DISEÑOS AGREGADOS - ${new Date().toLocaleDateString()}\n`;
    code += `// =========================================\n\n`;

    selectedFiles.forEach((file, index) => {
      const nextNum = currentFolder.nextNum + index;
      const ext = (file.name || 'png').toLowerCase().split('.').pop() || 'png';
      const designName = (file.name || 'Diseño nuevo')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      code += `  { \n`;
      code += `    id: ${nextNum},\n`;
      code += `    code: '${currentFolder.prefix}${String(nextNum).padStart(3, '0')}',\n`;
      code += `    name: '${designName}',\n`;
      code += `    img: '${currentFolder.path}${currentFolder.prefix}${nextNum}.${ext}',\n`;
      code += `    referencias: ['Nuevo diseño', '${designName}']\n`;
      code += `  },\n`;
    });

    setGeneratedCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const script = generateUploadScript();
    const blob = new Blob([script], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'upload-images.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Carpeta destino */}
      <div>
        <label className="block text-sm font-medium mb-2">📁 Carpeta de destino</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(IMAGE_FOLDERS).map(([key, folder]) => (
            <button
              key={key}
              onClick={() => setSelectedFolder(key)}
              className={`p-3 rounded-lg border text-left transition-all ${selectedFolder === key 
                ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                : 'border-border hover:border-primary/50'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{folder.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{folder.name}</p>
                  <p className="text-[10px] text-muted-foreground">{folder.prefix}XXX</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Área de arrastrar y seleccionar */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
      >
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="font-medium mb-2">Arrastra imágenes aquí</p>
        <p className="text-sm text-muted-foreground mb-4">o</p>
        
        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.gif,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Botón que activa el input */}
        <Button variant="outline" onClick={handleButtonClick}>
          Seleccionar archivos
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">Formatos: PNG, JPG, GIF, WebP</p>
      </div>

      {/* Archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">📄 Archivos seleccionados ({selectedFiles.length})</label>
            <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>Limpiar</Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <FileImage className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currentFolder.prefix}{currentFolder.nextNum + index}
                </span>
                <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button onClick={generateCode} className="mt-4 w-full" disabled={selectedFiles.length === 0}>
            <FileText className="w-4 h-4 mr-2" />
            Generar código para designs.ts
          </Button>
        </div>
      )}

      {/* Código generado */}
      {generatedCode && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">📝 Código para designs.ts</label>
            <Button variant="ghost" size="sm" onClick={copyCode}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}

      {/* Script de Node.js */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 mb-1">💡 Método recomendado: Script de Node.js</p>
            <p className="text-sm text-blue-700 mb-3">
              Descarga el script, colócalo en la raíz de tu proyecto y ejecútalo. Procesa imágenes automáticamente.
            </p>
            <Button size="sm" onClick={downloadScript} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Descargar upload-images.js
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE DE ESTADO DE CARPETAS ====================

const FolderStatus: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(IMAGE_FOLDERS).map(([key, folder]) => (
        <Card key={key}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{folder.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder.prefix}XXX.png</p>
              </div>
              <Badge variant="secondary" className={folder.color}>
                {folder.prefix}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Próximo: {folder.prefix}{String(folder.nextNum).padStart(3, '0')}</span>
              <Folder className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================

type TabType = 'dashboard' | 'export' | 'images' | 'faq';

const Admin: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [exporting, setExporting] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { title: 'Productos', value: CATALOG_PRODUCTS.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Poleras', value: CATALOG_PRODUCTS.filter(p => p.type === 'polera').length, icon: Package, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Sacos', value: CATALOG_PRODUCTS.filter(p => p.type === 'saco').length, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Blusas', value: CATALOG_PRODUCTS.filter(p => p.type === 'blusa').length, icon: Package, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Soleras', value: CATALOG_PRODUCTS.filter(p => p.type === 'solera').length, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Diseños', value: 13, icon: Image, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const menuItems = [
    { id: 'dashboard', name: 'Panel Principal', icon: Package },
    { id: 'export', name: 'Exportar Materiales', icon: Download },
    { id: 'images', name: 'Gestionar Imágenes', icon: Image },
    { id: 'faq', name: 'Gestionar FAQ', icon: HelpCircle },
  ];

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      let content: string, filename: string, mimeType: string;
      switch (type) {
        case 'banner': content = generateBannerHTML(); filename = 'yolimar-banner.html'; mimeType = 'text/html'; break;
        case 'catalog': content = generateCatalogHTML(); filename = 'yolimar-catalogo.html'; mimeType = 'text/html'; break;
        case 'excel': content = generateExcelCSV(); filename = 'yolimar-productos.csv'; mimeType = 'text/csv'; break;
        default: return;
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
    } finally {
      setExporting(null);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Bienvenido, {user?.name} ({user?.role})</p>
            </div>
            <Button variant="outline" onClick={logout}>Cerrar Sesión</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle className="text-lg">Menú</CardTitle></CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 px-2 pb-2">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {stats.map(stat => (
                    <Card key={stat.title}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardHeader><CardTitle>Productos Recientes</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4">Código</th>
                            <th className="text-left py-3 px-4">Nombre</th>
                            <th className="text-left py-3 px-4">Tipo</th>
                            <th className="text-left py-3 px-4">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATALOG_PRODUCTS.slice(0, 5).map(product => (
                            <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{product.code}</td>
                              <td className="py-3 px-4">{product.name}</td>
                              <td className="py-3 px-4 capitalize">{product.type}</td>
                              <td className="py-3 px-4">{product.variants.reduce((s, v) => s + v.stock, 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Herramientas de Exportación</h2>
                  <p className="text-muted-foreground">Genera materiales promocionales</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-100 text-blue-600">
                        <Image className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">Exportar Banner</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Genera un banner publicitario</p>
                      <Button onClick={() => handleExport('banner')} disabled={exporting !== null} className="w-full">
                        {exporting === 'banner' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</> : <><Download className="w-4 h-4 mr-2" />Exportar Banner</>}
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-green-100 text-green-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">Exportar Catálogo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Genera un catálogo completo</p>
                      <Button onClick={() => handleExport('catalog')} disabled={exporting !== null} className="w-full">
                        {exporting === 'catalog' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</> : <><Download className="w-4 h-4 mr-2" />Exportar Catálogo</>}
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-100 text-purple-600">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">Exportar Excel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Exporta productos a Excel</p>
                      <Button onClick={() => handleExport('excel')} disabled={exporting !== null} variant="outline" className="w-full">
                        {exporting === 'excel' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</> : <><Download className="w-4 h-4 mr-2" />Exportar Excel</>}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Gestionar Imágenes</h2>
                  <p className="text-muted-foreground">Sube imágenes y genera código automáticamente</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="w-5 h-5" />
                      Estado de carpetas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FolderStatus />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Cargar nuevas imágenes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'faq' && <FAQAdminPanel />}
          </div>
        </div>
      </div>
    </main>
  );
};

const FAQAdminPanel: React.FC = () => {
  const faqCategories = [
    { id: 'pedidos', name: 'Pedidos', count: 3 },
    { id: 'pagos', name: 'Pagos', count: 4 },
    { id: 'envios', name: 'Envíos', count: 2 },
    { id: 'devoluciones', name: 'Devoluciones', count: 5 },
    { id: 'personalizados', name: 'Personalizados', count: 3 },
    { id: 'atencion', name: 'Atención', count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestionar FAQ</h2>
        <p className="text-muted-foreground">Administra las preguntas frecuentes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {faqCategories.map(cat => (
          <Card key={cat.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-black text-primary">{cat.count}</p>
              <p className="text-sm text-muted-foreground">{cat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Información</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium mb-2">📝 Nota</p>
            <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
              <li>Para editar preguntas, modifica el archivo FAQ.tsx</li>
              <li>Los clientes acceden desde /preguntas-frecuentes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
