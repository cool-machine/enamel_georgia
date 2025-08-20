#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';

config();

const BASE_URL = 'http://localhost:3001/api/v1';
const timestamp = Date.now();

async function testAuthentication() {
  console.log('🧪 Manual Authentication Test');
  console.log('============================\n');

  try {
    // 1. Test Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: `testuser${timestamp}@example.com`,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    const userId = registerResponse.data.data?.user?.id;
    console.log('   User ID:', userId);

    // 2. Test Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: `testuser${timestamp}@example.com`,
      password: 'TestPass123!'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    const { accessToken, refreshToken } = loginResponse.data.data;
    console.log('   Got access token:', !!accessToken);
    console.log('   Got refresh token:', !!refreshToken);

    // 3. Test Protected Route
    console.log('\n3. Testing Protected Route Access...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile access successful:', profileResponse.data.data.user.email);
    console.log('   User role:', profileResponse.data.data.user.role);

    // 4. Test Product Access
    console.log('\n4. Testing Product Access...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Products retrieved:', productsResponse.data.data?.products?.length, 'products');

    // 5. Test Admin-only Endpoint (should fail for regular user)
    console.log('\n5. Testing Admin-only Access (should fail)...');
    try {
      await axios.post(`${BASE_URL}/products`, {
        name: 'Test Product',
        type: 'Transparent',
        price: 25.99
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('❌ Admin access should have failed but succeeded');
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.log('✅ Admin access correctly denied:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    // 6. Test Token Refresh
    console.log('\n6. Testing Token Refresh...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken
    });
    console.log('✅ Token refresh successful');
    const newAccessToken = refreshResponse.data.data.accessToken;
    console.log('   Got new access token:', !!newAccessToken);

    // 7. Test Logout
    console.log('\n7. Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log('✅ Logout successful:', logoutResponse.data.message);

    // 8. Test Access After Logout
    console.log('\n8. Testing Access After Logout (should fail)...');
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${newAccessToken}` }
      });
      console.log('❌ Access after logout should have failed but succeeded');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Access correctly denied after logout:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    console.log('\n🎉 All authentication tests completed successfully!');
    
  } catch (error: any) {
    console.error('\n💥 Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAuthentication();