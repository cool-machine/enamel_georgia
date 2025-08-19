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

// Helper function to generate product data - NO fake color codes, use actual images
const createProduct = (
  type: 'transparent' | 'opaque' | 'opale',
  reference: string,
  price: number = 45
): Product => {
  const typePrefix = type === 'transparent' ? 'T' : type === 'opaque' ? 'O' : 'OP';
  const folder = type === 'transparent' ? 'transparent_colors' : type === 'opaque' ? 'opaques' : 'opale_colors';
  
  return {
    id: `${type.charAt(0)}-${reference}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typePrefix}-${reference}`,
    description: `Premium ${type} enamel with excellent quality and color depth. Perfect for professional jewelry making and artistic applications.`,
    price,
    colorCode: '', // Use empty string - we'll display actual image instead
    category: type, // Group by enamel type
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
  createProduct('transparent', '0', 42),
  createProduct('transparent', '8', 45),
  createProduct('transparent', '29', 46),
  createProduct('transparent', '39', 47),
  createProduct('transparent', '40', 48),
  createProduct('transparent', '41', 49),
  createProduct('transparent', '53', 46),
  createProduct('transparent', '104', 47),
  createProduct('transparent', '111', 45),
  createProduct('transparent', '194', 48),
  createProduct('transparent', '383', 49),
  createProduct('transparent', '388', 47),
  createProduct('transparent', '620', 50),
  createProduct('transparent', '1045', 52),
  createProduct('transparent', '1047', 53),
  createProduct('transparent', '1942', 55),
  createProduct('transparent', '2000', 51),
  createProduct('transparent', '2002', 50),
  createProduct('transparent', '2003', 49),
  createProduct('transparent', '4044836', 65),
  createProduct('transparent', '4046', 54),
  createProduct('transparent', '4940', 56),
  createProduct('transparent', '4942', 57),

  // OPALE ENAMELS - Based on actual images in /opale_colors/
  createProduct('opale', '08', 55),
  createProduct('opale', '8', 55),
  createProduct('opale', '101', 56),
  createProduct('opale', '607', 57),
  createProduct('opale', '609', 58),
  createProduct('opale', '610', 59),
  createProduct('opale', '6B10B', 58),
  createProduct('opale', 'swatch_2', 54),

  // OPAQUE ENAMELS - Based on actual images in /opaques/
  createProduct('opaque', '157', 44),
  createProduct('opaque', '195', 43),
  createProduct('opaque', '196', 43),
  createProduct('opaque', '248', 44),
  createProduct('opaque', '254', 43),
  createProduct('opaque', '289', 42),
  createProduct('opaque', '290', 42),
  createProduct('opaque', '291', 43),
  createProduct('opaque', '294', 44),
  createProduct('opaque', '295', 43),
  createProduct('opaque', '296', 42),
  createProduct('opaque', '300', 43),
  createProduct('opaque', '304', 44),
  createProduct('opaque', '306', 45),
  createProduct('opaque', '307', 46),
  createProduct('opaque', '309', 45),
  createProduct('opaque', '310', 44),
  createProduct('opaque', '430', 43),
  createProduct('opaque', '490', 44),
  createProduct('opaque', '491', 44),
  createProduct('opaque', '605', 42),
  createProduct('opaque', '606', 42),
  createProduct('opaque', '62', 43),
  createProduct('opaque', '630', 41),
  createProduct('opaque', '631', 41),
  createProduct('opaque', '632', 42),
  createProduct('opaque', '633', 42),
  createProduct('opaque', '634', 43),
  createProduct('opaque', '635', 43),
  createProduct('opaque', '636', 44),
  createProduct('opaque', '668', 45),
  createProduct('opaque', '68', 42),
  createProduct('opaque', '75', 41),
  createProduct('opaque', '76', 41),
  createProduct('opaque', '77', 42),
  createProduct('opaque', '78', 43),
  createProduct('opaque', '81', 44),
  createProduct('opaque', '82', 43),
  createProduct('opaque', '83', 42),
  createProduct('opaque', '84', 44),
  createProduct('opaque', '88', 43),
  createProduct('opaque', '90', 42),
  createProduct('opaque', '92', 42),
  createProduct('opaque', '98', 41),
  createProduct('opaque', 'r1_c8', 44),
];