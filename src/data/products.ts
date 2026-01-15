/**
 * CATÁLOGO CENTRALIZADO DE PRODUCTOS
 */

import { getPriceFromConfig } from './config';

export interface ProductVariant {
  color: string;
  size: string;
  stock: number;
  price: number;
  sku: string;
}

export interface Product {
  id: number;
  type: 'polera' | 'saco' | 'blusa' | 'solera'; // ✅ TIPOS EXPLÍCITOS
  name: string;
  code: string;
  description: string;
  material: string;
  variants: ProductVariant[];
  image: string;
  tag?: string;
  badge?: string;
}

// VARIABLES SEPARADAS POR TIPO - Estructura escalable
export const POLERAS_PRODUCTS: Product[] = [
  {
    id: 1,
    type: 'polera', // ✅ Tipo explícito
    name: 'Polera',
    code: 'POL-001',
    description: 'Polera Classic de algodón 100% brasilero, suave y duradera',
    material: 'Algodón 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('polera', 'M'), sku: 'POL-001-BLA-M' },
      { color: 'blanco', size: 'L', stock: 12, price: getPriceFromConfig('polera', 'L'), sku: 'POL-001-BLA-L' },
      { color: 'blanco', size: 'XL', stock: 12, price: getPriceFromConfig('polera', 'XL'), sku: 'POL-001-BLA-XL' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('polera', 'M'), sku: 'POL-001-NEG-M' },
      { color: 'negro', size: 'L', stock: 12, price: getPriceFromConfig('polera', 'L'), sku: 'POL-001-NEG-L' },
      { color: 'negro', size: 'XL', stock: 12, price: getPriceFromConfig('polera', 'L'), sku: 'POL-001-NEG-L' },
      { color: 'rojo', size: 'M', stock: 12, price: getPriceFromConfig('polera', 'M'), sku: 'POL-001-ROJ-M' },
      { color: 'azul', size: 'L', stock: 12, price: getPriceFromConfig('polera', 'L'), sku: 'POL-001-AZU-L' },
    ],
    image: 'imagenes/PolerasEstampado/POLESTM1.png',
    tag: 'TOP VENTA',
    badge: 'TOP VENTA'
  },
  {
    id: 2,
    type: 'polera',
    name: 'Polera',
    code: 'POL-002',
    description: 'Polera Poliester deportiva de poliester, ideal para sublimación',
    material: 'Poliester 100%',
    variants: [
      { color: 'blanco', size: 'S', stock: 20, price: getPriceFromConfig('polera', 'S'), sku: 'POL-002-BLA-S' },
      { color: 'blanco', size: 'M', stock: 18, price: getPriceFromConfig('polera', 'M'), sku: 'POL-002-BLA-M' },
      { color: 'blanco', size: 'L', stock: 15, price: getPriceFromConfig('polera', 'L'), sku: 'POL-002-BLA-L' },
      { color: 'gris', size: 'M', stock: 10, price: getPriceFromConfig('polera', 'M'), sku: 'POL-002-GRI-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM2.png',
    badge: 'NUEVO'
  },
  {
    id: 3,
    type: 'polera',
    name: 'Polera',
    code: 'POL-003',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-003-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-003-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-003-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-003-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM3.png',
    badge: 'POPULAR'
  },
  {
    id: 4,
    type: 'polera',
    name: 'Polera',
    code: 'POL-004',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-004-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-004-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-004-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-004-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM4.png',
    badge: 'POPULAR'
  },
  {
    id: 5,
    type: 'polera',
    name: 'Polera',
    code: 'POL-005',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-005-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-005-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-005-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-005-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM5.png',
    badge: 'POPULAR'
  },
  {
    id: 6,
    type: 'polera',
    name: 'Polera',
    code: 'POL-006',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-006-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-006-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-006-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-006-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM6.png',
    badge: 'POPULAR'
  },
  {
    id: 7,
    type: 'polera',
    name: 'Polera',
    code: 'POL-007',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-007-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-007-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-007-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-007-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM7.png',
    badge: 'POPULAR'
  },
  {
    id: 8,
    type: 'polera',
    name: 'Polera',
    code: 'POL-008',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-008-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-008-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-008-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-008-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM8.png',
    badge: 'POPULAR'
  },
  {
    id: 9,
    type: 'polera',
    name: 'Polera',
    code: 'POL-009',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-009-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-009-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-009-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-009-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM9.png',
    badge: 'POPULAR'
  },
  {
    id: 10,
    type: 'polera',
    name: 'Polera',
    code: 'POL-0010',
    description: 'Polera con estampados de anime populares',
    material: 'Algodón 100%',
    variants: [
      { color: 'negro', size: 'S', stock: 12, price: getPriceFromConfig('polera', 'S'), sku: 'POL-0010-NEG-S' },
      { color: 'negro', size: 'M', stock: 15, price: getPriceFromConfig('polera', 'M'), sku: 'POL-0010-NEG-M' },
      { color: 'negro', size: 'L', stock: 10, price: getPriceFromConfig('polera', 'L'), sku: 'POL-0010-NEG-L' },
      { color: 'blanco', size: 'M', stock: 8, price: getPriceFromConfig('polera', 'M'), sku: 'POL-0010-BLA-M' },
    ],
    image: '/imagenes/PolerasEstampado/POLESTM10.png',
    badge: 'POPULAR'
  }
];

export const SACOS_PRODUCTS: Product[] = [
  {
    id: 11,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-001',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-001-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-001-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-001-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-001-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-001-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'L'), sku: 'SAC-001-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG1.png',
    tag: 'PREMIUM'
  },
  {
    id: 12,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-002',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-002-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-002-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-002-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-002-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-002-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-002-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG2.png',
    tag: 'PREMIUM'
  },
  {
    id: 13,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-003',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-003-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-003-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-003-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-003-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-003-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'G'), sku: 'SAC-003-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG3.png',
    tag: 'PREMIUM'
  },
  {
    id: 14,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-004',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-004-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-004-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-004-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-004-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-004-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'L'), sku: 'SAC-004-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG4.png',
    tag: 'PREMIUM'
  },
  {
    id: 15,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-005',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-005-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-005-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'L'), sku: 'SAC-005-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG5.png',
    tag: 'PREMIUM'
  },
  {
    id: 16,
    type: 'saco',
    name: 'Saco',
    code: 'SAC-006',
    description: 'Saco elegante con detalles de randa, perfecto para ocasiones formales',
    material: 'Mezcla algodón-poliester',
    variants: [
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-005-ROS-M' },
      { color: 'rosa', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-ROS-G' },
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'S'), sku: 'SAC-005-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-BLA-G' },
      { color: 'negro', size: 'M', stock: 12, price: getPriceFromConfig('saco', 'M'), sku: 'SAC-005-NEG-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('saco', 'L'), sku: 'SAC-005-NEG-G' },
    ],
    image: '/imagenes/Sacos/sacoLARG6.png',
    tag: 'PREMIUM'
  }
];

export const BLUSAS_PRODUCTS: Product[] = [
  {
    id: 1,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-001',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST1.png'
  },
  {
    id: 2,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-002',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST2.png'
  },
  {
    id: 3,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-003',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST3.png'
  },
  {
    id: 4,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-004',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST4.png'
  },
  {
    id: 5,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-005',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST5.png'
  },
  {
    id: 6,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-006',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST6.png'
  },
  {
    id: 7,
    type: 'blusa',
    name: 'Blusa',
    code: 'BLU-007',
    description: 'Blusa de seda con corte elegante y acabado premium',
    material: 'Seda 100%',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('blusa', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('blusa', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Blusas/blusaEST7.png'
  }
];

export const SOLERAS_PRODUCTS: Product[] = [
  {
    id: 1,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-001',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Solera/solBLANCO1.png'
  },
  {
    id: 2,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-002',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Solera/solNegro1.png'
  },
  {
    id: 3,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-003',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Solera/solRojo1.png'
  },
  {
    id: 4,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-004',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },,
    ],
    image: '/imagenes/Solera/solAzul1.png'
  },
  {
    id: 5,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-005',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Solera/solVerde1.png'
  },
  {
    id: 6,
    type: 'solera',
    name: 'Solera',
    code: 'SOL-006',
    description: 'Solera tradicional boliviana con diseño clásico',
    material: 'Gasa',
    variants: [
      { color: 'blanco', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-BLA-M' },
      { color: 'blanco', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-BLA-G' },
      { color: 'rosa', size: 'M', stock: 12, price: getPriceFromConfig('solera', 'M'), sku: 'BLU-007-ROS-M' },
      { color: 'negro', size: 'G', stock: 12, price: getPriceFromConfig('solera', 'G'), sku: 'BLU-007-NEG-G' },
    ],
    image: '/imagenes/Solera/solGris1.png'
  }
];

// Actualizar CATALOG_PRODUCTS para usar las variables separadas
export const CATALOG_PRODUCTS: Product[] = [
  ...BLUSAS_PRODUCTS,
  ...POLERAS_PRODUCTS,
  ...SACOS_PRODUCTS,
  ...SOLERAS_PRODUCTS
];

// Función para obtener productos por tipo
export const getProductsByType = (type: string): Product[] => {
  switch (type) {
    case 'polera':
      return POLERAS_PRODUCTS;
    case 'saco':
      return SACOS_PRODUCTS;
    case 'blusa':
      return BLUSAS_PRODUCTS;
    case 'solera':
      return SOLERAS_PRODUCTS;
    default:
      return CATALOG_PRODUCTS;
  }
};

/**
 * Valida si una combinación de color y talla existe para un producto
 */
export const isVariantAvailable = (
  product: Product, 
  color: string, 
  size: string
): boolean => {
  return product.variants.some(v => v.color === color && v.size === size && v.stock > 0);
};

/**
 * Obtiene las tallas disponibles para un color específico
 */
export const getAvailableSizesForColor = (
  product: Product, 
  color: string
): string[] => {
  return product.variants
    .filter(v => v.color === color && v.stock > 0)
    .map(v => v.size);
};

/**
 * Obtiene los colores disponibles para una talla específica
 */
export const getAvailableColorsForSize = (
  product: Product, 
  size: string
): string[] => {
  return product.variants
    .filter(v => v.size === size && v.stock > 0)
    .map(v => v.color);
};

/**
 * Obtiene la variante exacta o null si no existe
 */
export const getExactVariant = (
  product: Product, 
  color: string, 
  size: string
): ProductVariant | undefined => {
  return product.variants.find(v => v.color === color && v.size === size);
};

/**
 * Calcula el precio con descuento aplicado (8.333% para cantidades ≥ 3)
 */
export const calculateDiscountedPrice = (
  basePrice: number, 
  quantity: number
): { unitPrice: number; totalPrice: number; discountPerUnit: number; totalDiscount: number } => {
  let discountPerUnit = 0;
  
  if (quantity >= 3) {
    // 8.333% de descuento
    discountPerUnit = Math.round((basePrice * 0.09333) * 100) / 100; // Redondeo a 2 decimales
  }
  
  const unitPrice = basePrice - discountPerUnit;
  const totalPrice = unitPrice * quantity;
  const totalDiscount = discountPerUnit * quantity;
  
  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    discountPerUnit,
    totalDiscount
  };
};

// Utility functions
export const getMinPriceFromProduct = (product: Product): number => {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map(v => v.price));
};

export const getMaxPriceFromProduct = (product: Product): number => {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.max(...product.variants.map(v => v.price));
};

export const getTotalStockFromProduct = (product: Product): number => {
  if (!product.variants || product.variants.length === 0) return 0;
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
};

export const getColorsFromProduct = (product: Product): string[] => {
  if (!product.variants || product.variants.length === 0) return [];
  return [...new Set(product.variants.map(v => v.color))];
};

export const getSizesFromProduct = (product: Product): string[] => {
  if (!product.variants || product.variants.length === 0) return [];
  return [...new Set(product.variants.map(v => v.size))];
};
