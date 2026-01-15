/**
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
    const m = f.match(new RegExp(`${prefix}(\d+)`, 'i'));
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
  
  console.log(`📸 Procesando ${files.length} imagen(es)...\n`);
  
  const designs = [];
  
  files.forEach((file) => {
    const oldPath = path.join(pending, file);
    const { folder, custom } = detectType(file);
    const target = path.join(CONFIG.basePath, folder);
    const prefix = custom ? CONFIG.estampariaPrefix : CONFIG.folders[folder].prefix;
    const next = getNextNum(target, prefix);
    const ext = path.extname(file).toLowerCase();
    const newName = custom 
      ? `${prefix}${next}${ext}`
      : `${prefix}${String(next).padStart(3, '0')}${ext}`;
    
    fs.renameSync(oldPath, path.join(target, newName));
    console.log(`✅ ${file} → ${folder}/${newName}`);
    
    if (custom) {
      const name = path.parse(file).name
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      designs.push({
        id: next,
        code: `${prefix}${String(next).padStart(3, '0')}`,
        name,
        img: `imagenes/${folder}/${newName}`,
        referencias: ['Nuevo diseño', name]
      });
    }
  });
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('📝 CÓDIGO PARA AGREGAR A designs.ts:');
  console.log('═══════════════════════════════════════════════\n');
  
  if (designs.length > 0) {
    console.log('// =========================================');
    console.log('// DISEÑOS AGREGADOS');
    console.log('// Fecha:', new Date().toLocaleDateString());
    console.log('// =========================================\n');
    
    designs.forEach(d => {
      console.log(`  { `);
      console.log(`    id: ${d.id},`);
      console.log(`    code: '${d.code}',`);
      console.log(`    name: '${d.name}',`);
      console.log(`    img: '${d.img}',`);
      console.log(`    referencias: [${d.referencias.map(r => `'${r}'`).join(', ')}]`);
      console.log(`  },`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ Proceso completado!');
  console.log('═══════════════════════════════════════════════');
};

processImages();
