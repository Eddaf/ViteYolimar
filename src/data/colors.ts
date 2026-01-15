/**
 * SISTEMA DE COLORES CENTRALIZADO
 * Todos los colores en HEX se definen aquí
 */

export const PRIMARY_COLOR_HEX = '#0d9488';

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const COLOR_SYSTEM = {
  primary: PRIMARY_COLOR_HEX,
  primaryDark: '#0f766e',
  primaryLight: '#14b8a6',
  secondary: '#ffffff',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  customAccent: '#a855f7',
  adminAccent: '#9333ea'
};

export const COLOR_MAP: Record<string, string> = {
  'negro': '#000000',
  'blanco': '#FFFFFF',
  'rosa': '#E91E63',
  'rojo': '#F44336',
  'azul': '#2196F3',
  'verde': '#4CAF50',
  'amarillo': '#FFEB3B',
  'naranja': '#FF9800',
  'morado': '#9C27B0',
  'gris': '#9E9E9E',
  'beige': '#D7CCC8',
  'marron': '#795548',
  'bordo': '#880E4F',
  'dorado': '#FFD700',
  'plata': '#C0C0C0'
};

export const COLOR_NAMES: Record<string, string> = {
  'negro': 'Negro',
  'blanco': 'Blanco',
  'rosa': 'Rosa',
  'rojo': 'Rojo',
  'azul': 'Azul',
  'verde': 'Verde',
  'amarillo': 'Amarillo',
  'naranja': 'Naranja',
  'morado': 'Morado',
  'gris': 'Gris',
  'beige': 'Beige',
  'marron': 'Marrón',
  'bordo': 'Bordó',
  'dorado': 'Dorado',
  'plata': 'Plata'
};
