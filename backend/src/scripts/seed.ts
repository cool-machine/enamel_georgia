import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper function to create slug from product name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to get all images from a directory
function getImagesFromDir(dirPath: string): string[] {
  const fullPath = path.join(__dirname, '../../..', dirPath);
  try {
    return fs.readdirSync(fullPath)
      .filter(file => file.endsWith('.jpg'))
      .map(file => file.replace('.jpg', ''));
  } catch (error) {
    console.log(`Directory ${dirPath} not found, skipping...`);
    return [];
  }
}

// Get pricing based on enamel type
function getPrice(type: string): number {
  switch (type) {
    case 'transparent': return 42 + Math.floor(Math.random() * 23); // 42-65
    case 'opale': return 54 + Math.floor(Math.random() * 6); // 54-59
    case 'opaque': 
    default: return 41 + Math.floor(Math.random() * 6); // 41-46
  }
}

// Create product data
function createProductData(type: 'transparent' | 'opaque' | 'opale', reference: string) {
  const typePrefix = type === 'transparent' ? 'T' : type === 'opaque' ? 'O' : 'OP';
  const folder = type === 'transparent' ? 'transparent_colors' : type === 'opaque' ? 'opaques' : 'opale_colors';
  const name = `${type.charAt(0).toUpperCase() + type.slice(1)} ${typePrefix}-${reference}`;
  const price = getPrice(type);
  
  return {
    name,
    description: `Premium ${type} enamel with excellent quality and color depth. Perfect for professional jewelry making and artistic applications.`,
    price,
    colorCode: '', // Empty - using real images
    category: type,
    type: type.toUpperCase() as any,
    image: `${folder}/${reference}.jpg`,
    inStock: true,
    quantity: Math.floor(Math.random() * 20) + 5, // 5-24
    enamelNumber: `${typePrefix}-${reference}`,
    slug: createSlug(name),
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: type === 'opale' ? ['25g', '100g'] : ['25g', '100g', '250g']
    },
    isActive: true,
    sortOrder: 0
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Get all enamel images
  const opaqueImages = getImagesFromDir('public/opaques');
  const transparentImages = getImagesFromDir('public/transparent_colors');
  const opaleImages = getImagesFromDir('public/opale_colors');

  console.log(`Found ${opaqueImages.length} opaque images`);
  console.log(`Found ${transparentImages.length} transparent images`);
  console.log(`Found ${opaleImages.length} opale images`);

  // Clear existing products
  console.log('🧹 Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create products
  const products = [
    // Transparent enamels
    ...transparentImages.map(ref => createProductData('transparent', ref)),
    // Opale enamels
    ...opaleImages.map(ref => createProductData('opale', ref)),
    // Opaque enamels
    ...opaqueImages.map(ref => createProductData('opaque', ref))
  ];

  console.log(`📦 Creating ${products.length} products...`);

  // Insert products in batches for better performance
  const batchSize = 50;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await prisma.product.createMany({
      data: batch,
      skipDuplicates: true
    });
    console.log(`   ✅ Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@enamelgeorgia.com',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKe3Oj5qZO3RWMS', // password: admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true,
      emailVerifiedAt: new Date()
    }
  });

  // Create test customer
  console.log('👤 Creating test customer...');
  const testUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKe3Oj5qZO3RWMS', // password: admin123
      firstName: 'Test',
      lastName: 'Customer',
      role: 'CUSTOMER',
      isEmailVerified: true,
      emailVerifiedAt: new Date()
    }
  });

  // Create test address for customer
  console.log('🏠 Creating test address...');
  await prisma.address.create({
    data: {
      userId: testUser.id,
      type: 'BOTH',
      firstName: 'Test',
      lastName: 'Customer',
      address1: '123 Rustaveli Avenue',
      city: 'Tbilisi',
      state: 'Tbilisi',
      postalCode: '0108',
      country: 'GE',
      phone: '+995 555 123 456',
      isDefault: true
    }
  });

  // Create some system settings
  console.log('⚙️ Creating system settings...');
  await prisma.setting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'Enamel Georgia',
        type: 'string'
      },
      {
        key: 'currency',
        value: 'GEL',
        type: 'string'
      },
      {
        key: 'tax_rate',
        value: '0.18',
        type: 'number'
      },
      {
        key: 'free_shipping_threshold',
        value: '100',
        type: 'number'
      },
      {
        key: 'default_shipping_cost',
        value: '10',
        type: 'number'
      }
    ]
  });

  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();

  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   Products: ${totalProducts}`);
  console.log(`   Users: ${totalUsers}`);
  console.log(`   Admin: admin@enamelgeorgia.com (password: admin123)`);
  console.log(`   Test Customer: customer@example.com (password: admin123)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });