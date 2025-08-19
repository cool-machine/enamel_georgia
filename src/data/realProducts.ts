export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  colorCode: string;
  category: string;
  type: 'transparent' | 'opaque' | 'opale';
  image: string;
  inStock: boolean;
  quantity: number;
  enamelNumber: string;
  specifications: {
    firingTemp: string;
    mesh: string;
    weight: string[];
  };
}

// Helper function to generate product data
const createProduct = (
  type: 'transparent' | 'opaque' | 'opale',
  reference: string,
  colorCode: string = '#888888',
  category: string = 'mixed',
  price: number = 45
): Product => {
  const typePrefix = type === 'transparent' ? 'T' : type === 'opaque' ? 'O' : 'OP';
  const folder = type === 'transparent' ? 'transparent_colors' : type === 'opaque' ? 'opaques' : 'opale_colors';
  
  return {
    id: `${type.charAt(0)}-${reference}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typePrefix}-${reference}`,
    description: `Premium ${type} enamel with excellent quality and color depth. Perfect for professional jewelry making and artistic applications.`,
    price,
    colorCode,
    category,
    type,
    image: `/${folder}/${reference}.jpg`,
    inStock: true,
    quantity: Math.floor(Math.random() * 20) + 5, // Random quantity between 5-24
    enamelNumber: `${typePrefix}-${reference}`,
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: type === 'opale' ? ['25g', '100g'] : ['25g', '100g', '250g']
    }
  };
};

export const realProducts: Product[] = [
  // TRANSPARENT ENAMELS - Based on actual images in /transparent_colors/
  createProduct('transparent', '0', '#FFFFFF', 'clear', 42),
  createProduct('transparent', '8', '#FFA500', 'orange', 45),
  createProduct('transparent', '29', '#8B4513', 'brown', 46),
  createProduct('transparent', '39', '#FF6347', 'red', 47),
  createProduct('transparent', '40', '#DC143C', 'red', 48),
  createProduct('transparent', '41', '#B22222', 'red', 49),
  createProduct('transparent', '53', '#4B0082', 'violet', 46),
  createProduct('transparent', '104', '#9370DB', 'violet', 47),
  createProduct('transparent', '111', '#2F4F4F', 'gray', 45),
  createProduct('transparent', '194', '#008B8B', 'teal', 48),
  createProduct('transparent', '383', '#006400', 'green', 49),
  createProduct('transparent', '388', '#32CD32', 'green', 47),
  createProduct('transparent', '620', '#0000FF', 'blue', 50),
  createProduct('transparent', '1045', '#BA55D3', 'violet', 52),
  createProduct('transparent', '1047', '#8A2BE2', 'violet', 53),
  createProduct('transparent', '1942', '#FF4500', 'orange', 55),
  createProduct('transparent', '2000', '#FF1493', 'pink', 51),
  createProduct('transparent', '2002', '#FF69B4', 'pink', 50),
  createProduct('transparent', '2003', '#FFB6C1', 'pink', 49),
  createProduct('transparent', '4044836', '#4B0082', 'violet', 65),
  createProduct('transparent', '4046', '#4169E1', 'blue', 54),
  createProduct('transparent', '4940', '#191970', 'blue', 56),
  createProduct('transparent', '4942', '#000080', 'blue', 57),

  // OPALE ENAMELS - Based on actual images in /opale_colors/
  createProduct('opale', '08', '#F5F5DC', 'beige', 55),
  createProduct('opale', '8', '#F0F8FF', 'blue', 55),
  createProduct('opale', '101', '#FFB6C1', 'pink', 56),
  createProduct('opale', '607', '#E0E0E0', 'gray', 57),
  createProduct('opale', '609', '#D3D3D3', 'gray', 58),
  createProduct('opale', '610', '#90EE90', 'green', 59),
  createProduct('opale', '6B10B', '#E6E6FA', 'lavender', 58),
  createProduct('opale', 'swatch_2', '#F8F8FF', 'white', 54),

  // OPAQUE ENAMELS - Based on actual images in /opaques/
  createProduct('opaque', '157', '#800080', 'purple', 44),
  createProduct('opaque', '195', '#4682B4', 'blue', 43),
  createProduct('opaque', '196', '#5F9EA0', 'teal', 43),
  createProduct('opaque', '248', '#FF6347', 'red', 44),
  createProduct('opaque', '254', '#FF4500', 'orange', 43),
  createProduct('opaque', '289', '#FFFF00', 'yellow', 42),
  createProduct('opaque', '290', '#ADFF2F', 'lime', 42),
  createProduct('opaque', '291', '#32CD32', 'green', 43),
  createProduct('opaque', '294', '#006400', 'green', 44),
  createProduct('opaque', '295', '#2E8B57', 'green', 43),
  createProduct('opaque', '296', '#8FBC8F', 'green', 42),
  createProduct('opaque', '300', '#87CEEB', 'blue', 43),
  createProduct('opaque', '304', '#4169E1', 'blue', 44),
  createProduct('opaque', '306', '#0000CD', 'blue', 45),
  createProduct('opaque', '307', '#191970', 'blue', 46),
  createProduct('opaque', '309', '#4B0082', 'violet', 45),
  createProduct('opaque', '310', '#8B008B', 'purple', 44),
  createProduct('opaque', '430', '#D2691E', 'brown', 43),
  createProduct('opaque', '490', '#A0522D', 'brown', 44),
  createProduct('opaque', '491', '#8B4513', 'brown', 44),
  createProduct('opaque', '605', '#DCDCDC', 'gray', 42),
  createProduct('opaque', '606', '#C0C0C0', 'gray', 42),
  createProduct('opaque', '62', '#FFD700', 'yellow', 43),
  createProduct('opaque', '630', '#FFF8DC', 'cream', 41),
  createProduct('opaque', '631', '#F5DEB3', 'beige', 41),
  createProduct('opaque', '632', '#DEB887', 'tan', 42),
  createProduct('opaque', '633', '#D2B48C', 'tan', 42),
  createProduct('opaque', '634', '#BC8F8F', 'rose', 43),
  createProduct('opaque', '635', '#F4A460', 'brown', 43),
  createProduct('opaque', '636', '#DAA520', 'gold', 44),
  createProduct('opaque', '668', '#2F4F4F', 'gray', 45),
  createProduct('opaque', '68', '#FFA500', 'orange', 42),
  createProduct('opaque', '75', '#FFB6C1', 'pink', 41),
  createProduct('opaque', '76', '#FF69B4', 'pink', 41),
  createProduct('opaque', '77', '#FF1493', 'pink', 42),
  createProduct('opaque', '78', '#DC143C', 'red', 43),
  createProduct('opaque', '81', '#000080', 'blue', 44),
  createProduct('opaque', '82', '#4169E1', 'blue', 43),
  createProduct('opaque', '83', '#87CEEB', 'blue', 42),
  createProduct('opaque', '84', '#40E0D0', 'teal', 44),
  createProduct('opaque', '88', '#2E8B57', 'green', 43),
  createProduct('opaque', '90', '#90EE90', 'green', 42),
  createProduct('opaque', '92', '#98FB98', 'green', 42),
  createProduct('opaque', '98', '#F0E68C', 'yellow', 41),
  createProduct('opaque', 'r1_c8', '#8B4513', 'brown', 44),
];