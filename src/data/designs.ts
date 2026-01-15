/**
 * BASE DE DATOS DE DISEÑOS/ESTAMPADOS - REFACTORIZADO Y OPTIMIZADO
 * Versión mejorada con tamaños proporcionales
 */

export interface Design {
  id: number;
  code: string;        // ✅ NUEVO: Código identificador del diseño
  name: string;
  img: string;
  referencias: string[];
}

export interface ShirtColorImage {
  hex: string;
  img: string;
  imgDefault: string;
}

export interface ShirtColors {
  [key: string]: ShirtColorImage;
}

export interface ShirtType {
  _meta: { material: string };
  colors: ShirtColors;
}

// Validación de rutas de imágenes
const validateImagePath = (path: string): string => {
  if (!path || typeof path !== 'string') {
    console.warn('Ruta de imagen inválida:', path);
    return 'imagenes/PolerasAlgodon/poleraBlancoALG_default.png';
  }
  return path;
};

export const SHIRT_TYPES: Record<string, ShirtType> = {
  Algodon: {
    _meta: { material: 'Algodón Brasilero 100%' },
    colors: {
      blanco: {
        hex: '#FFFFFF',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraBlancoALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraBlancoALG_default.png')
      },
      negro: {
        hex: '#1a1a1a',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraNegroALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraNegroALG_default.png')
      },
      rojo: {
        hex: '#dc2626',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraRojoALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraRojoALG_default.png')
      },
      azul: {
        hex: '#2563eb',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraAzulALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraAzulALG_default.png')
      },
      verde: {
        hex: '#16a34a',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraVerdeALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraVerdeALG_default.png')
      },
      gris: {
        hex: '#6b7280',
        img: validateImagePath('imagenes/PolerasAlgodon/poleraGrisALG1.png'),
        imgDefault: validateImagePath('imagenes/PolerasAlgodon/poleraGrisALG_default.png')
      }
    }
  },
  Poliester: {
    _meta: { material: 'Poliester 100%' },
    colors: {
      blanco: {
        hex: '#FFFFFF',
        img: validateImagePath('imagenes/PolerasPoliester/poleraBlancoPOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraBlancoP_default.png')
      },
      negro: {
        hex: '#1a1a1a',
        img: validateImagePath('imagenes/PolerasPoliester/poleraNegroPOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraNegroP_default.png')
      },
      rojo: {
        hex: '#dc2626',
        img: validateImagePath('imagenes/PolerasPoliester/poleraRojoPOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraRojoP_default.png')
      },
      azul: {
        hex: '#2563eb',
        img: validateImagePath('imagenes/PolerasPoliester/poleraAzulPOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraAzulP_default.png')
      },
      verde: {
        hex: '#16a34a',
        img: validateImagePath('imagenes/PolerasPoliester/poleraVerdePOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraVerdeP_default.png')
      },
      gris: {
        hex: '#6b7280',
        img: validateImagePath('imagenes/PolerasPoliester/poleraGrisPOL1.png'),
        imgDefault: validateImagePath('imagenes/PolerasPoliester/poleraGrisP_default.png')
      }
    }
  },
  CuelloV: {
    _meta: { material: 'Poliester 100%' },
    colors: {
      blanco: {
        hex: '#FFFFFF',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraBlancoCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraBlancoCV_default.png')
      },
      negro: {
        hex: '#1a1a1a',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraNegroCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraNegroCV_default.png')
      },
      rojo: {
        hex: '#dc2626',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraRojoCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraRojoCV_default.png')
      },
      azul: {
        hex: '#2563eb',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraAzulCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraAzulCV_default.png')
      },
      verde: {
        hex: '#16a34a',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraVerdeCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraVerdeCV_default.png')
      },
      gris: {
        hex: '#6b7280',
        img: validateImagePath('imagenes/PolerasCuelloV/poleraGrisCV1.png'),
        imgDefault: validateImagePath('imagenes/PolerasCuelloV/poleraGrisCV_default.png')
      }
    }
  },
  TOP: {
    _meta: { material: 'Algodón 100%' },
    colors: {
      blanco: {
        hex: '#FFFFFF',
        img: validateImagePath('imagenes/PolerasTOP/TOPBlanco1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/poleraBlancoTOP_default.png')
      },
      negro: {
        hex: '#1a1a1a',
        img: validateImagePath('imagenes/PolerasTOP/topNegro1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/topNegroTOP_default.png')
      },
      rojo: {
        hex: '#dc2626',
        img: validateImagePath('imagenes/PolerasTOP/topRojo1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/topRojoTOP_default.png')
      },
      azul: {
        hex: '#2563eb',
        img: validateImagePath('imagenes/PolerasTOP/topAzul1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/topAzulTOP_default.png')
      },
      verde: {
        hex: '#16a34a',
        img: validateImagePath('imagenes/PolerasTOP/topVerde1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/topVerdeTOP_default.png')
      },
      gris: {
        hex: '#6b7280',
        img: validateImagePath('imagenes/PolerasTOP/topGris1.png'),
        imgDefault: validateImagePath('imagenes/PolerasTOP/topGrisTOP_default.png')
      }
    }
  }
};

// ✅ ORDEN INVERTIDO: El diseño más nuevo aparece primero
export const DESIGNS_DB: Design[] = [
  { id: 13, code: 'EST-013', name: 'Superman DC', img: 'imagenes/Estampado/EST_IMG13.png', referencias: ['DC', 'Super Man', 'Caricatura'] },
  { id: 12, code: 'EST-012', name: 'Stitch Disney', img: 'imagenes/Estampado/EST_IMG12.png', referencias: ['Disney', 'Stich', 'Arte'] },
  { id: 11, code: 'EST-011', name: 'Warhammer 40K', img: 'imagenes/Estampado/EST_IMG11.png', referencias: ['Escudo', 'Space Marine', 'Warhammer', '40K'] },
  { id: 10, code: 'EST-010', name: 'R2-D2 Robot', img: 'imagenes/Estampado/EST_IMG10.png', referencias: ['Disney', 'Star War', 'R2 D2', 'Robot'] },
  { id: 9, code: 'EST-009', name: 'Panda Zen', img: 'imagenes/Estampado/EST_IMG9.png', referencias: ['Panda', 'Animal', 'Arte'] },
  { id: 8, code: 'EST-008', name: 'Nami One Piece', img: 'imagenes/Estampado/EST_IMG8.png', referencias: ['Nami', 'Luffy', 'One piece'] },
  { id: 7, code: 'EST-007', name: 'Mono Artístico', img: 'imagenes/Estampado/EST_IMG7.png', referencias: ['Mono', 'Arte', 'Animal'] },
  { id: 6, code: 'EST-006', name: 'Star Wars', img: 'imagenes/Estampado/EST_IMG6.png', referencias: ['Disney', 'Star War', 'Guerrero'] },
  { id: 5, code: 'EST-005', name: 'Leona Salvaje', img: 'imagenes/Estampado/EST_IMG5.png', referencias: ['Leona', 'Animal', 'Arte'] },
  { id: 4, code: 'EST-004', name: 'Hunter x Hunter', img: 'imagenes/Estampado/EST_IMG4.png', referencias: ['Huntrix', 'K-Pop', 'Anime'] },
  { id: 3, code: 'EST-003', name: 'León Heráldico', img: 'imagenes/Estampado/EST_IMG3.png', referencias: ['Leon', 'Escudo', 'Animal'] },
  { id: 2, code: 'EST-002', name: 'Luffy One Piece', img: 'imagenes/Estampado/EST_IMG2.png', referencias: ['Luffy', 'One Piece', 'Anime'] },
  { id: 1, code: 'EST-001', name: 'Cuervo Escudo', img: 'imagenes/Estampado/EST_IMG1.png', referencias: ['Cuervo', 'Escudos', 'Animal'] }
];

/**
 * Obtiene el material de un tipo de polera
 * @param type - Tipo de polera
 * @returns Material especificado o mensaje de error
 */
export const getMaterial = (type: string): string => {
  if (!type || !SHIRT_TYPES[type]) {
    console.warn(`Tipo de polera no encontrado: ${type}`);
    return 'Material no especificado';
  }
  return SHIRT_TYPES[type]._meta.material;
};

/**
 * Obtiene la imagen de la polera según tipo y color
 * @param type - Tipo de polera (Algodon, Poliester, etc)
 * @param color - Color seleccionado
 * @returns Objeto con hex, img y imgDefault
 */
export const getShirtImage = (type: string, color: string): ShirtColorImage => {
  const shirtType = SHIRT_TYPES[type];
  
  if (!shirtType) {
    console.warn(`Tipo de polera no encontrado: ${type}`);
    return {
      hex: '#FFFFFF',
      img: 'imagenes/PolerasAlgodon/poleraBlancoALG_default.png',
      imgDefault: 'imagenes/PolerasAlgodon/poleraBlancoALG_default.png'
    };
  }

  const colorData = shirtType.colors[color];
  
  if (!colorData) {
    console.warn(`Color no encontrado para tipo ${type}: ${color}`);
    return shirtType.colors['blanco'] || {
      hex: '#FFFFFF',
      img: 'imagenes/PolerasAlgodon/poleraBlancoALG_default.png',
      imgDefault: 'imagenes/PolerasAlgodon/poleraBlancoALG_default.png'
    };
  }

  return colorData;
};

/**
 * Valida que un diseño exista en la base de datos
 * @param designId - ID del diseño
 * @returns El diseño o undefined
 */
export const getDesignById = (designId: number): Design | undefined => {
  return DESIGNS_DB.find(design => design.id === designId);
};

/**
 * Obtiene el primer diseño válido de la base de datos
 * @returns Primer diseño o un diseño por defecto
 */
export const getDefaultDesign = (): Design => {
  if (DESIGNS_DB.length === 0) {
    console.warn('Base de datos de diseños vacía');
    return {
      id: 0,
      code: 'N/A',
      name: 'Sin diseños disponibles',
      img: '',
      referencias: []
    };
  }
  return DESIGNS_DB[0];
};
