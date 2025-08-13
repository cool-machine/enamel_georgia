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
    id: 't-1044',
    name: 'Violet Clair T-1044',
    description: 'Light violet transparent enamel with delicate purple hues, perfect for layering and creating depth.',
    price: 45,
    colorCode: '#D8BFD8',
    category: 'violet',
    type: 'transparent',
    image: '/images/t-1044.jpg',
    inStock: true,
    quantity: 15,
    enamelNumber: 'T-1044',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-1045',
    name: 'Violet Moyen T-1045',
    description: 'Medium violet transparent enamel with rich purple tones.',
    price: 45,
    colorCode: '#BA55D3',
    category: 'violet',
    type: 'transparent',
    image: '/images/t-1045.jpg',
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
    id: 't-1046',
    name: 'Violet Foncé T-1046',
    description: 'Deep violet transparent enamel with intense purple saturation.',
    price: 47,
    colorCode: '#9370DB',
    category: 'violet',
    type: 'transparent',
    image: '/images/t-1046.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'T-1046',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-2006',
    name: 'Rouge Cerise T-2006',
    description: 'Cherry red transparent enamel with brilliant clarity and vibrant red tones.',
    price: 48,
    colorCode: '#DC143C',
    category: 'red',
    type: 'transparent',
    image: '/images/t-2006.jpg',
    inStock: true,
    quantity: 20,
    enamelNumber: 'T-2006',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-2005',
    name: 'Rouge Foncé T-2005',
    description: 'Deep red transparent enamel with rich wine-like tones.',
    price: 48,
    colorCode: '#B22222',
    category: 'red',
    type: 'transparent',
    image: '/images/t-2005.jpg',
    inStock: true,
    quantity: 14,
    enamelNumber: 'T-2005',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-20',
    name: 'Rouge Sang T-20',
    description: 'Blood red transparent enamel with intense depth and clarity.',
    price: 50,
    colorCode: '#8B0000',
    category: 'red',
    type: 'transparent',
    image: '/images/t-20.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'T-20',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-38',
    name: 'Orange Cuivre T-38',
    description: 'Copper orange transparent enamel with warm metallic undertones.',
    price: 46,
    colorCode: '#FF6347',
    category: 'orange',
    type: 'transparent',
    image: '/images/t-38.jpg',
    inStock: true,
    quantity: 13,
    enamelNumber: 'T-38',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-610',
    name: 'Bleu Turquoise T-610',
    description: 'Turquoise blue transparent enamel with crystal-clear brilliance.',
    price: 49,
    colorCode: '#40E0D0',
    category: 'blue',
    type: 'transparent',
    image: '/images/t-610.jpg',
    inStock: true,
    quantity: 17,
    enamelNumber: 'T-610',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-240',
    name: 'Vert Émeraude T-240',
    description: 'Emerald green transparent enamel with precious stone-like clarity.',
    price: 52,
    colorCode: '#50C878',
    category: 'green',
    type: 'transparent',
    image: '/images/t-240.jpg',
    inStock: true,
    quantity: 11,
    enamelNumber: 'T-240',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 't-164',
    name: 'Bleu Royal T-164',
    description: 'Royal blue transparent enamel with deep, rich blue tones.',
    price: 49,
    colorCode: '#1E3A8A',
    category: 'blue',
    type: 'transparent',
    image: '/images/t-164.jpg',
    inStock: true,
    quantity: 19,
    enamelNumber: 'T-164',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },

  // OPAQUE ENAMELS
  {
    id: 'o-625',
    name: 'Jaune Or O-625',
    description: 'Golden yellow opaque enamel with rich, warm tones and excellent coverage.',
    price: 42,
    colorCode: '#FFD700',
    category: 'yellow',
    type: 'opaque',
    image: '/images/o-625.jpg',
    inStock: true,
    quantity: 22,
    enamelNumber: 'O-625',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-204',
    name: 'Rouge Vermillon O-204',
    description: 'Vermillion red opaque enamel with vibrant, warm red coverage.',
    price: 44,
    colorCode: '#E34234',
    category: 'red',
    type: 'opaque',
    image: '/images/o-204.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'O-204',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-74',
    name: 'Rose Pâle O-74',
    description: 'Pale pink opaque enamel with delicate, soft rose tones.',
    price: 41,
    colorCode: '#FFB6C1',
    category: 'pink',
    type: 'opaque',
    image: '/images/o-74.jpg',
    inStock: true,
    quantity: 25,
    enamelNumber: 'O-74',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-418',
    name: 'Beige Sable O-418',
    description: 'Sand beige opaque enamel with warm, neutral earth tones.',
    price: 40,
    colorCode: '#D2B48C',
    category: 'beige',
    type: 'opaque',
    image: '/images/o-418.jpg',
    inStock: true,
    quantity: 20,
    enamelNumber: 'O-418',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-244',
    name: 'Bleu Ciel O-244',
    description: 'Sky blue opaque enamel with clear, bright blue coverage.',
    price: 43,
    colorCode: '#87CEEB',
    category: 'blue',
    type: 'opaque',
    image: '/images/o-244.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'O-244',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-81',
    name: 'Bleu Marine O-81',
    description: 'Navy blue opaque enamel with deep, sophisticated blue tones.',
    price: 44,
    colorCode: '#000080',
    category: 'blue',
    type: 'opaque',
    image: '/images/o-81.jpg',
    inStock: true,
    quantity: 14,
    enamelNumber: 'O-81',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-400',
    name: 'Vert Sapin O-400',
    description: 'Pine green opaque enamel with rich, forest green coverage.',
    price: 43,
    colorCode: '#355E3B',
    category: 'green',
    type: 'opaque',
    image: '/images/o-400.jpg',
    inStock: true,
    quantity: 15,
    enamelNumber: 'O-400',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-177',
    name: 'Noir Profond O-177',
    description: 'Deep black opaque enamel with complete coverage and rich depth.',
    price: 40,
    colorCode: '#000000',
    category: 'black',
    type: 'opaque',
    image: '/images/o-177.jpg',
    inStock: true,
    quantity: 28,
    enamelNumber: 'O-177',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-161',
    name: 'Jaune Citron O-161',
    description: 'Lemon yellow opaque enamel with bright, vibrant yellow coverage.',
    price: 41,
    colorCode: '#FFFF00',
    category: 'yellow',
    type: 'opaque',
    image: '/images/o-161.jpg',
    inStock: true,
    quantity: 21,
    enamelNumber: 'O-161',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-634',
    name: 'Orange Vif O-634',
    description: 'Bright orange opaque enamel with vivid, energetic orange tones.',
    price: 42,
    colorCode: '#FF6600',
    category: 'orange',
    type: 'opaque',
    image: '/images/o-634.jpg',
    inStock: true,
    quantity: 17,
    enamelNumber: 'O-634',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-205',
    name: 'Rouge Carmin O-205',
    description: 'Carmine red opaque enamel with deep, rich red coverage.',
    price: 44,
    colorCode: '#DC143C',
    category: 'red',
    type: 'opaque',
    image: '/images/o-205.jpg',
    inStock: true,
    quantity: 19,
    enamelNumber: 'O-205',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-274',
    name: 'Violet O-274',
    description: 'Pure violet opaque enamel with rich purple coverage.',
    price: 43,
    colorCode: '#8A2BE2',
    category: 'violet',
    type: 'opaque',
    image: '/images/o-274.jpg',
    inStock: true,
    quantity: 13,
    enamelNumber: 'O-274',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-85',
    name: 'Beige Rosé O-85',
    description: 'Rose beige opaque enamel with warm, pinkish beige tones.',
    price: 40,
    colorCode: '#F5DEB3',
    category: 'beige',
    type: 'opaque',
    image: '/images/o-85.jpg',
    inStock: true,
    quantity: 23,
    enamelNumber: 'O-85',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-294',
    name: 'Gris Perle O-294',
    description: 'Pearl gray opaque enamel with elegant, neutral gray coverage.',
    price: 41,
    colorCode: '#C0C0C0',
    category: 'gray',
    type: 'opaque',
    image: '/images/o-294.jpg',
    inStock: true,
    quantity: 18,
    enamelNumber: 'O-294',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-160',
    name: 'Vert Pomme O-160',
    description: 'Apple green opaque enamel with fresh, bright green coverage.',
    price: 42,
    colorCode: '#8DB600',
    category: 'green',
    type: 'opaque',
    image: '/images/o-160.jpg',
    inStock: true,
    quantity: 16,
    enamelNumber: 'O-160',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },
  {
    id: 'o-248',
    name: 'Vert Émeraude O-248',
    description: 'Emerald green opaque enamel with rich, jewel-like green tones.',
    price: 45,
    colorCode: '#50C878',
    category: 'green',
    type: 'opaque',
    image: '/images/o-248.jpg',
    inStock: true,
    quantity: 14,
    enamelNumber: 'O-248',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g', '250g']
    }
  },

  // OPALE ENAMELS
  {
    id: 'op-104',
    name: 'Opale Rose OP-104',
    description: 'Rose opal enamel with delicate pink opalescent effects and subtle shimmer.',
    price: 55,
    colorCode: '#FFC0CB',
    category: 'pink',
    type: 'opale',
    image: '/images/op-104.jpg',
    inStock: true,
    quantity: 8,
    enamelNumber: 'OP-104',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-407',
    name: 'Opale Beige OP-407',
    description: 'Beige opal enamel with warm opalescent tones and subtle color variations.',
    price: 54,
    colorCode: '#F5F5DC',
    category: 'beige',
    type: 'opale',
    image: '/images/op-407.jpg',
    inStock: true,
    quantity: 10,
    enamelNumber: 'OP-407',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-406',
    name: 'Opale Bleu OP-406',
    description: 'Blue opal enamel with ethereal blue opalescent effects.',
    price: 56,
    colorCode: '#ADD8E6',
    category: 'blue',
    type: 'opale',
    image: '/images/op-406.jpg',
    inStock: true,
    quantity: 7,
    enamelNumber: 'OP-406',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-600',
    name: 'Opale Blanc OP-600',
    description: 'White opal enamel with pure opalescent shimmer and rainbow highlights.',
    price: 53,
    colorCode: '#FFFAFA',
    category: 'white',
    type: 'opale',
    image: '/images/op-600.jpg',
    inStock: true,
    quantity: 12,
    enamelNumber: 'OP-600',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-601',
    name: 'Opale Gris OP-601',
    description: 'Gray opal enamel with sophisticated gray opalescent tones.',
    price: 54,
    colorCode: '#D3D3D3',
    category: 'gray',
    type: 'opale',
    image: '/images/op-601.jpg',
    inStock: true,
    quantity: 9,
    enamelNumber: 'OP-601',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  },
  {
    id: 'op-610-b',
    name: 'Opale Vert OP-610B',
    description: 'Green opal enamel with mystical green opalescent effects.',
    price: 55,
    colorCode: '#90EE90',
    category: 'green',
    type: 'opale',
    image: '/images/op-610b.jpg',
    inStock: true,
    quantity: 6,
    enamelNumber: 'OP-610B',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  }
];