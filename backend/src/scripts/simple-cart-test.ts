#!/usr/bin/env tsx

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

async function testBasicCartFlow() {
  console.log('🧪 Testing Basic Cart Flow...');
  
  try {
    // 1. Get products
    console.log('\n1. Getting products...');
    const products = await axios.get(`${BASE_URL}/products?limit=1`);
    console.log('✅ Products retrieved:', products.data.data.length);
    
    if (products.data.data.length === 0) {
      throw new Error('No products available');
    }

    const productId = products.data.data[0].id;
    const sessionId = `test-${Date.now()}`;

    // 2. Add to cart (guest)
    console.log('\n2. Adding item to guest cart...');
    const addResult = await axios.post(`${BASE_URL}/cart/items`, {
      productId,
      quantity: 1
    }, {
      headers: { 'x-session-id': sessionId }
    });
    console.log('✅ Item added to cart:', addResult.data.success);

    // 3. Get cart
    console.log('\n3. Getting cart...');
    const cartResult = await axios.get(`${BASE_URL}/cart`, {
      headers: { 'x-session-id': sessionId }
    });
    console.log('✅ Cart retrieved with items:', cartResult.data.data.cart?.items?.length || 0);

    // 4. Register user
    console.log('\n4. Registering user...');
    const timestamp = Date.now();
    const registerResult = await axios.post(`${BASE_URL}/auth/register`, {
      email: `test${timestamp}@example.com`,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ User registered:', registerResult.data.success);

    // 5. Login user
    console.log('\n5. Logging in user...');
    const loginResult = await axios.post(`${BASE_URL}/auth/login`, {
      email: `test${timestamp}@example.com`,
      password: 'TestPass123!'
    });
    console.log('✅ User logged in:', loginResult.data.success);
    console.log('   Login data structure:', Object.keys(loginResult.data.data || {}));

    const accessToken = loginResult.data.data?.accessToken;
    console.log('   Access token received:', !!accessToken);

    if (accessToken) {
      // 6. Transfer cart
      console.log('\n6. Transferring guest cart...');
      const transferResult = await axios.post(`${BASE_URL}/cart/transfer`, {
        sessionId
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('✅ Cart transfer:', transferResult.data.success);

      // 7. Get user cart
      console.log('\n7. Getting user cart...');
      const userCartResult = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('✅ User cart items:', userCartResult.data.data.cart?.items?.length || 0);
    }

    console.log('\n🎉 Basic cart flow test completed successfully!');

  } catch (error: any) {
    console.error('\n💥 Test failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`Error:`, error.message);
    }
  }
}

testBasicCartFlow();