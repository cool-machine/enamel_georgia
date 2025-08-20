import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';
const TIMEOUT = 5000;

// Configure axios
const api = axios.create({
  baseURL: API_BASE,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
}

const results: TestResult[] = [];

async function testEndpoint(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  expectedStatus: number = 200
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    let response;
    switch (method) {
      case 'GET':
        response = await api.get(endpoint);
        break;
      case 'POST':
        response = await api.post(endpoint, data);
        break;
      case 'PUT':
        response = await api.put(endpoint, data);
        break;
      case 'DELETE':
        response = await api.delete(endpoint);
        break;
    }
    
    const responseTime = Date.now() - startTime;
    const success = response.status === expectedStatus;
    
    return {
      endpoint,
      method,
      success,
      status: response.status,
      responseTime
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      endpoint,
      method,
      success: false,
      status: error.response?.status,
      error: error.message,
      responseTime
    };
  }
}

async function runTests() {
  console.log('🧪 Starting API Endpoint Tests...\n');

  // Test 1: Health check
  console.log('1. Testing health endpoints...');
  results.push(await testEndpoint('GET', '/health'));
  results.push(await testEndpoint('GET', '/status'));

  // Test 2: Product endpoints (will fail without database, but tests routes)
  console.log('2. Testing product endpoints...');
  results.push(await testEndpoint('GET', '/products'));
  results.push(await testEndpoint('GET', '/products/stats'));
  results.push(await testEndpoint('GET', '/products/featured'));
  results.push(await testEndpoint('GET', '/products/types/summary'));

  // Test 3: Search endpoints
  console.log('3. Testing search endpoints...');
  results.push(await testEndpoint('GET', '/products/search?q=blue'));
  
  // Test 4: Validation tests
  console.log('4. Testing validation...');
  results.push(await testEndpoint('GET', '/products?page=0', undefined, 400));
  results.push(await testEndpoint('GET', '/products/search?q=a', undefined, 400));
  
  // Test 5: Product CRUD (will fail without database)
  console.log('5. Testing product CRUD...');
  const newProduct = {
    name: 'Test Transparent Enamel',
    description: 'A test transparent enamel for API testing',
    price: 45.50,
    colorCode: '',
    category: 'transparent',
    type: 'TRANSPARENT',
    image: 'test_image.jpg',
    enamelNumber: 'T-TEST-001',
    specifications: {
      firingTemp: '780-820°C',
      mesh: '80 mesh',
      weight: ['25g', '100g']
    }
  };
  
  results.push(await testEndpoint('POST', '/products', newProduct, 201));
  
  // Test invalid product creation
  results.push(await testEndpoint('POST', '/products', { name: 'a' }, 400));

  // Display results
  console.log('\n📊 Test Results:');
  console.log('================');
  
  let passed = 0;
  let failed = 0;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const timing = result.responseTime ? `(${result.responseTime}ms)` : '';
    
    console.log(`${index + 1}. ${status} ${result.method} ${result.endpoint} ${timing}`);
    
    if (!result.success) {
      console.log(`   Error: ${result.error || `HTTP ${result.status}`}`);
      failed++;
    } else {
      passed++;
    }
  });
  
  console.log('\n📈 Summary:');
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  // Analysis
  console.log('\n🔍 Analysis:');
  if (failed > 0) {
    const dbErrors = results.filter(r => r.error?.includes('database server') || r.error?.includes('prisma')).length;
    if (dbErrors > 0) {
      console.log(`⚠️  ${dbErrors} tests failed due to database connection (expected)`);
      console.log('   Run database setup: npm run db:setup && npm run db:migrate && npm run db:seed');
    }
    
    const validationPassed = results.filter(r => r.endpoint.includes('?') && r.status === 400).length;
    if (validationPassed > 0) {
      console.log(`✅ ${validationPassed} validation tests passed correctly`);
    }
  }
  
  console.log('\n🎉 API structure test completed!');
}

// Run tests
runTests().catch(console.error);