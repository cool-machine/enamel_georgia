import { prisma } from '@/models';

async function testDatabaseConnection() {
  console.log('🔌 Testing database connection...');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version() as version`;
    console.log('📊 Database version:', (result as any)[0]?.version?.split(' ')[0] || 'Unknown');
    
    // Test table existence (will only work after migration)
    try {
      const productCount = await prisma.product.count();
      const userCount = await prisma.user.count();
      
      console.log('📈 Current data:');
      console.log(`   Products: ${productCount}`);
      console.log(`   Users: ${userCount}`);
    } catch (error) {
      console.log('⚠️  Tables not found - run migrations first: npm run db:migrate');
    }
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();