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

export const mockProducts: Product[] = [
  // TRANSPARENT ENAMELS
  {
    id: 't-0',
    name: 'Transparent T-0',
    description: 'Clear transparent enamel, perfect base for layering and creating depth effects.',
    price: 42,
    colorCode: '#FFFFFF',
    category: 'clear',
    type: 'transparent',
    image: '/transparent_colors/0.jpg',
    inStock: true,
    quantity: 25,
    enamelNumber: 'T-0',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-8',
    name: 'Transparent T-8',
    description: 'Warm transparent enamel with subtle amber undertones.',
    price: 45,
    colorCode: '#FFA500',
    category: 'orange',
    type: 'transparent',
    image: '/transparent_colors/8.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'T-8',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-29',
    name: 'Transparent T-29',
    description: 'Rich transparent enamel with deep, vibrant tones.',
    price: 46,
    colorCode: '#8B4513',
    category: 'brown',
    type: 'transparent',
    image: '/transparent_colors/29.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'T-29',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-39',
    name: 'Transparent T-39',
    description: 'Brilliant transparent enamel with excellent clarity and color depth.',
    price: 47,
    colorCode: '#FF6347',
    category: 'red',
    type: 'transparent',
    image: '/transparent_colors/39.jpg',
    inStock: true,
    quantity: 20,
    enamelNumber: 'T-39',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-40',
    name: 'Transparent T-40',
    description: 'Elegant transparent enamel with refined color expression.',
    price: 48,
    colorCode: '#DC143C',
    category: 'red',
    type: 'transparent',
    image: '/transparent_colors/40.jpg',
    inStock: true,
    quantity: 15,
    enamelNumber: 'T-40',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-41',
    name: 'Transparent T-41',
    description: 'Premium transparent enamel with exceptional brilliance.',
    price: 49,
    colorCode: '#B22222',
    category: 'red',
    type: 'transparent',
    image: '/transparent_colors/41.jpg',
    inStock: true,
    quantity: 14,
    enamelNumber: 'T-41',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-53',
    name: 'Transparent T-53',
    description: 'Sophisticated transparent enamel with rich color saturation.',
    price: 46,
    colorCode: '#4B0082',
    category: 'violet',
    type: 'transparent',
    image: '/transparent_colors/53.jpg',
    inStock: true,
    quantity: 19,
    enamelNumber: 'T-53',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-104',
    name: 'Transparent T-104',
    description: 'Beautiful transparent enamel with delicate color expression.',
    price: 47,
    colorCode: '#9370DB',
    category: 'violet',
    type: 'transparent',
    image: '/transparent_colors/104.jpg',
    inStock: true,
    quantity: 17,
    enamelNumber: 'T-104',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-111',
    name: 'Transparent T-111',
    description: 'Classic transparent enamel with timeless appeal.',
    price: 45,
    colorCode: '#2F4F4F',
    category: 'gray',
    type: 'transparent',
    image: '/transparent_colors/111.jpg',
    inStock: true,
    quantity: 22,
    enamelNumber: 'T-111',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-194',
    name: 'Transparent T-194',
    description: 'Vibrant transparent enamel with excellent light transmission.',
    price: 48,
    colorCode: '#008B8B',
    category: 'teal',
    type: 'transparent',
    image: '/transparent_colors/194.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'T-194',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-383',
    name: 'Transparent T-383',
    description: 'Intense transparent enamel with deep color richness.',
    price: 49,
    colorCode: '#006400',
    category: 'green',
    type: 'transparent',
    image: '/transparent_colors/383.jpg',
    inStock: true,
    quantity: 13,
    enamelNumber: 'T-383',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-388',
    name: 'Transparent T-388',
    description: 'Exquisite transparent enamel with brilliant clarity.',
    price: 47,
    colorCode: '#32CD32',
    category: 'green',
    type: 'transparent',
    image: '/transparent_colors/388.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'T-388',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-620',
    name: 'Transparent T-620',
    description: 'Stunning transparent enamel with captivating color depth.',
    price: 50,
    colorCode: '#0000FF',
    category: 'blue',
    type: 'transparent',
    image: '/transparent_colors/620.jpg',
    inStock: true,
    quantity: 15,
    enamelNumber: 'T-620',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-1045',
    name: 'Transparent T-1045',
    description: 'Premium transparent enamel with exceptional quality.',
    price: 52,
    colorCode: '#BA55D3',
    category: 'violet',
    type: 'transparent',
    image: '/transparent_colors/1045.jpg',
    inStock: true,
    quantity: 12,
    enamelNumber: 'T-1045',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-1047',
    name: 'Transparent T-1047',
    description: 'Magnificent transparent enamel with superior brilliance.',
    price: 53,
    colorCode: '#8A2BE2',
    category: 'violet',
    type: 'transparent',
    image: '/transparent_colors/1047.jpg',
    inStock: true,
    quantity: 11,
    enamelNumber: 'T-1047',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-1942',
    name: 'Transparent T-1942',
    description: 'Rare transparent enamel with unique color characteristics.',
    price: 55,
    colorCode: '#FF4500',
    category: 'orange',
    type: 'transparent',
    image: '/transparent_colors/1942.jpg',
    inStock: true,
    quantity: 8,
    enamelNumber: 'T-1942',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 't-2000',
    name: 'Transparent T-2000',
    description: 'Contemporary transparent enamel with modern appeal.',
    price: 51,
    colorCode: '#FF1493',
    category: 'pink',
    type: 'transparent',
    image: '/transparent_colors/2000.jpg',
    inStock: true,
    quantity: 14,
    enamelNumber: 'T-2000',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-2002',
    name: 'Transparent T-2002',
    description: 'Elegant transparent enamel with refined color expression.',
    price: 50,
    colorCode: '#FF69B4',
    category: 'pink',
    type: 'transparent',
    image: '/transparent_colors/2002.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'T-2002',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-2003',
    name: 'Transparent T-2003',
    description: 'Brilliant transparent enamel with exceptional clarity.',
    price: 49,
    colorCode: '#FFB6C1',
    category: 'pink',
    type: 'transparent',
    image: '/transparent_colors/2003.jpg',
    inStock: true,
    quantity: 19,
    enamelNumber: 'T-2003',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-4046',
    name: 'Transparent T-4046',
    description: 'Specialty transparent enamel with unique properties.',
    price: 54,
    colorCode: '#4169E1',
    category: 'blue',
    type: 'transparent',
    image: '/transparent_colors/4046.jpg',
    inStock: true,
    quantity: 10,
    enamelNumber: 'T-4046',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 't-4940',
    name: 'Transparent T-4940',
    description: 'Professional grade transparent enamel with superior quality.',
    price: 56,
    colorCode: '#191970',
    category: 'blue',
    type: 'transparent',
    image: '/transparent_colors/4940.jpg',
    inStock: true,
    quantity: 7,
    enamelNumber: 'T-4940',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 't-4942',
    name: 'Transparent T-4942',
    description: 'Artisan quality transparent enamel with exceptional brilliance.',
    price: 57,
    colorCode: '#000080',
    category: 'blue',
    type: 'transparent',
    image: '/transparent_colors/4942.jpg',
    inStock: true,
    quantity: 6,
    enamelNumber: 'T-4942',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 't-4044836',
    name: 'Transparent T-4044836',
    description: 'Limited edition transparent enamel with exclusive formulation.',
    price: 65,
    colorCode: '#4B0082',
    category: 'violet',
    type: 'transparent',
    image: '/transparent_colors/4044836.jpg',
    inStock: true,
    quantity: 3,
    enamelNumber: 'T-4044836',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g']
    }
  },

  // OPALE ENAMELS
  {
    id: 'op-6b10b',
    name: 'Opale OP-6B10B',
    description: 'Unique opale enamel with special opalescent effects.',
    price: 58,
    colorCode: '#E6E6FA',
    category: 'lavender',
    type: 'opale',
    image: '/opale_colors/6B10B.jpg',
    inStock: true,
    quantity: 9,
    enamelNumber: 'OP-6B10B',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-8',
    name: 'Opale OP-8',
    description: 'Beautiful opale enamel with subtle shimmer effects.',
    price: 55,
    colorCode: '#F0F8FF',
    category: 'blue',
    type: 'opale',
    image: '/opale_colors/8.jpg',
    inStock: true,
    quantity: 12,
    enamelNumber: 'OP-8',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-08',
    name: 'Opale OP-08',
    description: 'Refined opale enamel with delicate opalescent qualities.',
    price: 55,
    colorCode: '#F5F5DC',
    category: 'beige',
    type: 'opale',
    image: '/opale_colors/08.jpg',
    inStock: true,
    quantity: 11,
    enamelNumber: 'OP-08',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-101',
    name: 'Opale OP-101',
    description: 'Classic opale enamel with traditional opalescent beauty.',
    price: 56,
    colorCode: '#FFB6C1',
    category: 'pink',
    type: 'opale',
    image: '/opale_colors/101.jpg',
    inStock: true,
    quantity: 8,
    enamelNumber: 'OP-101',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-607',
    name: 'Opale OP-607',
    description: 'Premium opale enamel with exceptional opalescent effects.',
    price: 57,
    colorCode: '#E0E0E0',
    category: 'gray',
    type: 'opale',
    image: '/opale_colors/607.jpg',
    inStock: true,
    quantity: 10,
    enamelNumber: 'OP-607',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-609',
    name: 'Opale OP-609',
    description: 'Sophisticated opale enamel with complex color variations.',
    price: 58,
    colorCode: '#D3D3D3',
    category: 'gray',
    type: 'opale',
    image: '/opale_colors/609.jpg',
    inStock: true,
    quantity: 7,
    enamelNumber: 'OP-609',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-610',
    name: 'Opale OP-610',
    description: 'Magnificent opale enamel with brilliant opalescent shimmer.',
    price: 59,
    colorCode: '#90EE90',
    category: 'green',
    type: 'opale',
    image: '/opale_colors/610.jpg',
    inStock: true,
    quantity: 6,
    enamelNumber: 'OP-610',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },

  // OPAQUE ENAMELS
  {
    id: 'o-62',
    name: 'Opaque O-62',
    description: 'Rich opaque enamel with excellent coverage and color depth.',
    price: 43,
    colorCode: '#FFD700',
    category: 'yellow',
    type: 'opaque',
    image: '/opaques/62.jpg',
    inStock: true,
    quantity: 20,
    enamelNumber: 'O-62',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-68',
    name: 'Opaque O-68',
    description: 'Vibrant opaque enamel with superior opacity and finish.',
    price: 42,
    colorCode: '#FFA500',
    category: 'orange',
    type: 'opaque',
    image: '/opaques/68.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'O-68',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-75',
    name: 'Opaque O-75',
    description: 'Beautiful opaque enamel with smooth, even coverage.',
    price: 41,
    colorCode: '#FFB6C1',
    category: 'pink',
    type: 'opaque',
    image: '/opaques/75.jpg',
    inStock: true,
    quantity: 22,
    enamelNumber: 'O-75',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-76',
    name: 'Opaque O-76',
    description: 'Classic opaque enamel with traditional color appeal.',
    price: 41,
    colorCode: '#FF69B4',
    category: 'pink',
    type: 'opaque',
    image: '/opaques/76.jpg',
    inStock: true,
    quantity: 19,
    enamelNumber: 'O-76',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-77',
    name: 'Opaque O-77',
    description: 'Premium opaque enamel with exceptional quality.',
    price: 42,
    colorCode: '#FF1493',
    category: 'pink',
    type: 'opaque',
    image: '/opaques/77.jpg',
    inStock: true,
    quantity: 17,
    enamelNumber: 'O-77',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-78',
    name: 'Opaque O-78',
    description: 'Elegant opaque enamel with refined color expression.',
    price: 43,
    colorCode: '#DC143C',
    category: 'red',
    type: 'opaque',
    image: '/opaques/78.jpg',
    inStock: true,
    quantity: 21,
    enamelNumber: 'O-78',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-81',
    name: 'Opaque O-81',
    description: 'Deep navy blue opaque enamel with rich, professional finish.',
    price: 44,
    colorCode: '#000080',
    category: 'blue',
    type: 'opaque',
    image: '/opaques/81.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'O-81',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-82',
    name: 'Opaque O-82',
    description: 'Brilliant blue opaque enamel with excellent coverage.',
    price: 43,
    colorCode: '#4169E1',
    category: 'blue',
    type: 'opaque',
    image: '/opaques/82.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'O-82',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-83',
    name: 'Opaque O-83',
    description: 'Sky blue opaque enamel with clear, bright appearance.',
    price: 42,
    colorCode: '#87CEEB',
    category: 'blue',
    type: 'opaque',
    image: '/opaques/83.jpg',
    inStock: true,
    quantity: 20,
    enamelNumber: 'O-83',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-84',
    name: 'Opaque O-84',
    description: 'Turquoise opaque enamel with vibrant color intensity.',
    price: 44,
    colorCode: '#40E0D0',
    category: 'teal',
    type: 'opaque',
    image: '/opaques/84.jpg',
    inStock: true,
    quantity: 15,
    enamelNumber: 'O-84',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  }
];