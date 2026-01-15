/**
 * CONFIGURACIÓN CENTRALIZADA DE PRECIOS Y DESCUENTOS
 */

export interface PriceGroup {
  id: string;
  base: number;
  label: string;
}

export interface DiscountConfig {
  enabled: boolean;
  discountPerUnit: number; // Descuento en Bs por prenda
  minQuantity: number;
  description: string;
}

export interface TypeConfig {
  id: string;
  name: string;
  image: string;
  hasSizes: string[];
  pricesBySizeGroup: Record<string, PriceGroup>;
  discount: DiscountConfig;
  description: string;
}

export const SIZE_GROUPS: Record<string, string> = {
  'XS': 'S',
  'S': 'S',
  'M': 'ML',
  'L': 'ML',
  'XL': 'XL',
  'XXL': 'XL'
};

// ✅ Tipo permitido: solo los keys de CONFIG_DATA.types
export type ProductType = keyof typeof CONFIG_DATA.types;

export interface Product {
  id: string;
  name: string;
  type: ProductType; // ✅ solo valores válidos
  description: string;
  image: string;
  badge?: string;
  variants: {
    color: string;
    sizes: {
      size: string;
      stock: number;
    }[];
  }[];
}

// ✅ DESCUENTOS DIFERENCIADOS POR SECCIÓN
export const CATALOG_DISCOUNT: DiscountConfig = {
  enabled: true,
  discountPerUnit: 1.5, // Bs por prenda
  minQuantity: 3,
  description: 'Descuento por mayor (-3 Bs por prenda a partir de 3 unidades)'
};

export const DESIGN_DISCOUNT: DiscountConfig = {
  enabled: true,
  discountPerUnit: 1.5, // Bs por prenda
  minQuantity: 12,
  description: 'Descuento por mayor personalizado (-20 Bs total a partir de 12 prendas)'
};

export const CONFIG_DATA = {
  types: {
    polera: {
      id: 'polera',
      name: 'polera',
      image: '/placeholder.svg',
      hasSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      pricesBySizeGroup: {
        'S': { id: 'pg_polera_s', base: 55, label: 'Talla S' },
        'ML': { id: 'pg_polera_ml', base: 55, label: 'Tallas M, L' },
        'XL': { id: 'pg_polera_xl', base: 60, label: 'Tallas XL, XXL' }
      },
      discount: CATALOG_DISCOUNT,
      description: 'Poleras básicas de algodón'
    },
    saco: {
      id: 'saco',
      name: 'saco',
      image: '/placeholder.svg',
      hasSizes: ['M', 'G', 'GG', '52'],
      pricesBySizeGroup: {
        'S': { id: 'pg_saco_s', base: 100, label: 'Talla S' },
        'ML': { id: 'pg_saco_ml', base: 100, label: 'Tallas M, L' },
        'XL': { id: 'pg_saco_xl', base: 110, label: 'Tallas XL, XXL' }
      },
      discount: CATALOG_DISCOUNT,
      description: 'Abrigos y sacos formales'
    },
    blusa: {
      id: 'blusa',
      name: 'blusa',
      image: '/placeholder.svg',
      hasSizes: ['M', 'G', 'GG', '52'],
      pricesBySizeGroup: {
        'S': { id: 'pg_blusa_s', base: 50, label: 'Talla S' },
        'ML': { id: 'pg_blusa_ml', base: 50, label: 'Tallas M, L' },
        'XL': { id: 'pg_blusa_xl', base: 55, label: 'Talla XL' }
      },
      discount: CATALOG_DISCOUNT,
      description: 'Blusas y tops elegantes'
    },
    solera: {
      id: 'solera',
      name: 'solera',
      image: '/placeholder.svg',
      hasSizes: ['M', 'G', 'GG', '52'],
      pricesBySizeGroup: {
        'S': { id: 'pg_solera_s', base: 50, label: 'Talla S' },
        'ML': { id: 'pg_solera_ml', base: 50, label: 'Tallas M, L' },
        'XL': { id: 'pg_solera_xl', base: 55, label: 'Talla XL' }
      },
      discount: CATALOG_DISCOUNT,
      description: 'Prendas tradicionales'
    }
  } as Record<string, TypeConfig>,
  customConfig: {
    id: 'custom',
    name: 'Polera Personalizada',
    emoji: '🎨',
    basePrice: 60,
    pricesBySizeGroup: {
      'S': { id: 'pg_custom_s', base: 60, label: 'Talla S' },
      'ML': { id: 'pg_custom_ml', base: 60, label: 'Tallas M, L' },
      'XL': { id: 'pg_custom_xl', base: 65, label: 'Tallas XL, XXL' }
    },
    discount: DESIGN_DISCOUNT, // ✅ Usa descuento de DISEÑO
    description: 'Poleras personalizadas del diseñador'
  }
};

export const PRODUCT_TYPE_KEYS = Object.keys(CONFIG_DATA.types) as Array<keyof typeof CONFIG_DATA.types>;
export type ProductTypeKey = keyof typeof CONFIG_DATA.types;

/**
 * ✅ FUNCIÓN UNIVERSAL DE DESCUENTO
 * Calcula precio con descuento diferenciado según el tipo
 * @param basePrice - Precio base sin descuento
 * @param quantity - Cantidad de prendas de este item
 * @param discountConfig - Configuración de descuento (CATALOG_DISCOUNT o DESIGN_DISCOUNT)
 * @returns Objeto con precios calculados y redondeados (SIN DECIMALES)
 */
export const applyDiscount = (
  basePrice: number,
  quantity: number,
  discountConfig: DiscountConfig
): {
  unitPrice: number;
  totalPrice: number;
  hasDiscount: boolean;
  totalDiscount: number;
  discountPercentage: number;
} => {
  if (!discountConfig.enabled || quantity < discountConfig.minQuantity) {
    return {
      unitPrice: Math.round(basePrice),
      totalPrice: Math.round(basePrice * quantity),
      hasDiscount: false,
      totalDiscount: 0,
      discountPercentage: 0
    };
  }

  // Aplicar descuento fijo por prenda
  const unitPrice = basePrice - discountConfig.discountPerUnit;
  const totalPrice = unitPrice * quantity;
  const totalDiscount = discountConfig.discountPerUnit * quantity;
  
  // Calcular porcentaje de descuento para mostrar
  const discountPercentage = Math.round((discountConfig.discountPerUnit / basePrice) * 100 * 100) / 100;

  return {
    unitPrice: Math.round(unitPrice),
    totalPrice: Math.round(totalPrice),
    hasDiscount: true,
    totalDiscount: Math.round(totalDiscount),
    discountPercentage
  };
};

/**
 * ✅ NUEVA FUNCIÓN: DESCUENTO POR TOTAL DE DISEÑOS PERSONALIZADOS
 * Aplica descuento cuando el TOTAL de prendas personalizadas >= 12
 * @param basePrice - Precio base sin descuento
 * @param quantity - Cantidad de este item específico
 * @param totalCustomItems - TOTAL de prendas personalizadas en el carrito
 * @returns Objeto con precios calculados
 */
export const applyDesignDiscount = (
  basePrice: number,
  quantity: number,
  totalCustomItems: number
): {
  unitPrice: number;
  totalPrice: number;
  hasDiscount: boolean;
  totalDiscount: number;
  discountPercentage: number;
  minQuantity: number;
  description: string;
} => {
  const minQuantity = DESIGN_DISCOUNT.minQuantity; // 12
  
  // Solo aplica si el total de items personalizados >= 12
  if (totalCustomItems < minQuantity) {
    return {
      unitPrice: Math.round(basePrice),
      totalPrice: Math.round(basePrice * quantity),
      hasDiscount: false,
      totalDiscount: 0,
      discountPercentage: 0,
      minQuantity,
      description: `Agrega ${minQuantity - totalCustomItems} prenda(s) más para obtener descuento`
    };
  }

  // Aplicar descuento fijo por prenda (-1.667 Bs por prenda)
  const unitPrice = basePrice - DESIGN_DISCOUNT.discountPerUnit;
  const totalPrice = unitPrice * quantity;
  const totalDiscount = DESIGN_DISCOUNT.discountPerUnit * quantity;
  
  // Calcular porcentaje de descuento
  const discountPercentage = Math.round((DESIGN_DISCOUNT.discountPerUnit / basePrice) * 100 * 100) / 100;

  return {
    unitPrice: Math.round(unitPrice),
    totalPrice: Math.round(totalPrice),
    hasDiscount: true,
    totalDiscount: Math.round(totalDiscount),
    discountPercentage,
    minQuantity,
    description: DESIGN_DISCOUNT.description
  };
};

/**
 * ✅ FUNCIÓN PARA CATÁLOGO
 * Aplica descuento de CATÁLOGO (3+ prendas = -5 Bs)
 */
export const getPriceWithCatalogDiscount = (
  type: string,
  size: string,
  quantity: number
): {
  basePrice: number;
  unitPrice: number;
  totalPrice: number;
  hasDiscount: boolean;
  totalDiscount: number;
  discountPercentage: number;
  minQuantity: number;
  description: string;
} => {
  const config = CONFIG_DATA.types[type];
  if (!config) {
    return {
      basePrice: 0,
      unitPrice: 0,
      totalPrice: 0,
      hasDiscount: false,
      totalDiscount: 0,
      discountPercentage: 0,
      minQuantity: CATALOG_DISCOUNT.minQuantity,
      description: CATALOG_DISCOUNT.description
    };
  }

  const group = SIZE_GROUPS[size] || 'ML';
  const basePrice = config.pricesBySizeGroup[group]?.base || 0;

  const result = applyDiscount(basePrice, quantity, CATALOG_DISCOUNT);

  return {
    basePrice,
    unitPrice: result.unitPrice,
    totalPrice: result.totalPrice,
    hasDiscount: result.hasDiscount,
    totalDiscount: result.totalDiscount,
    discountPercentage: result.discountPercentage,
    minQuantity: CATALOG_DISCOUNT.minQuantity,
    description: CATALOG_DISCOUNT.description
  };
};

/**
 * ✅ FUNCIÓN PARA DISEÑO (VERSION SIMPLE - 12+ de este item)
 * Aplica descuento de DISEÑO (12+ prendas = -20 Bs total)
 * @deprecated Usar getPriceWithDesignDiscountV2 con totalCustomItems
 */
export const getPriceWithDesignDiscount = (
  size: string,
  quantity: number,
  basePrice: number = 60
): {
  basePrice: number;
  unitPrice: number;
  totalPrice: number;
  hasDiscount: boolean;
  totalDiscount: number;
  discountPercentage: number;
  minQuantity: number;
  description: string;
} => {
  const group = SIZE_GROUPS[size] || 'ML';
  const finalBasePrice = CONFIG_DATA.customConfig.pricesBySizeGroup[group]?.base || basePrice;

  const result = applyDiscount(finalBasePrice, quantity, DESIGN_DISCOUNT);

  return {
    basePrice: finalBasePrice,
    unitPrice: result.unitPrice,
    totalPrice: result.totalPrice,
    hasDiscount: result.hasDiscount,
    totalDiscount: result.totalDiscount,
    discountPercentage: result.discountPercentage,
    minQuantity: DESIGN_DISCOUNT.minQuantity,
    description: DESIGN_DISCOUNT.description
  };
};

/**
 * ✅ NUEVA FUNCIÓN: DISEÑO CON TOTAL DE ITEMS PERSONALIZADOS
 * Aplica descuento cuando el TOTAL de prendas personalizadas >= 12
 * Esta es la función que debe usar CartContext y CartDrawer
 */
export const getPriceWithDesignDiscountV2 = (
  size: string,
  quantity: number,
  totalCustomItems: number,
  basePrice: number = 60
): {
  basePrice: number;
  unitPrice: number;
  totalPrice: number;
  hasDiscount: boolean;
  totalDiscount: number;
  discountPercentage: number;
  minQuantity: number;
  description: string;
} => {
  const group = SIZE_GROUPS[size] || 'ML';
  const finalBasePrice = CONFIG_DATA.customConfig.pricesBySizeGroup[group]?.base || basePrice;

  const result = applyDesignDiscount(finalBasePrice, quantity, totalCustomItems);

  return {
    basePrice: finalBasePrice,
    unitPrice: result.unitPrice,
    totalPrice: result.totalPrice,
    hasDiscount: result.hasDiscount,
    totalDiscount: result.totalDiscount,
    discountPercentage: result.discountPercentage,
    minQuantity: result.minQuantity,
    description: result.description
  };
};

/**
 * ✅ FUNCIÓN HEREDADA (para compatibilidad)
 * Usa descuento de CATÁLOGO por defecto
 */
export const getPriceWithDiscount = (
  type: string,
  size: string,
  quantity: number,
  isCustom: boolean = false,
  totalCustomItems: number = 0 // ✅ NUEVO: parámetro opcional
) => {
  if (isCustom) {
    // Si nos pasan totalCustomItems, usar la nueva función V2
    if (totalCustomItems > 0) {
      return getPriceWithDesignDiscountV2(size, quantity, totalCustomItems);
    }
    return getPriceWithDesignDiscount(size, quantity);
  }
  return getPriceWithCatalogDiscount(type, size, quantity);
};

/**
 * ✅ FUNCIONES AUXILIARES
 */
export const getDiscountPercentage = (): number => CATALOG_DISCOUNT.discountPerUnit;
export const isDiscountEnabled = (): boolean => CATALOG_DISCOUNT.enabled;
export const getDiscountMinQuantity = (): number => CATALOG_DISCOUNT.minQuantity;
export const getDiscountDescription = (): string => CATALOG_DISCOUNT.description;

export const getPriceFromConfig = (typeId: string, size: string): number => {
  const config = CONFIG_DATA.types[typeId];
  if (!config) return 0;
  const group = SIZE_GROUPS[size] || 'ML';
  return config.pricesBySizeGroup[group]?.base || 0;
};

export const getPriceByTypeAndSize = (type: string, size: string, isCustom: boolean = false): number => {
  if (isCustom) {
    const config = CONFIG_DATA.customConfig;
    const group = SIZE_GROUPS[size] || 'ML';
    return config.pricesBySizeGroup[group]?.base || 60;
  }
  const config = CONFIG_DATA.types[type];
  if (!config) return 55;
  const group = SIZE_GROUPS[size] || 'ML';
  return config.pricesBySizeGroup[group]?.base || 55;
};
