#!/usr/bin/env tsx

import axios, { AxiosError } from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/v1`;

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class AuthTester {
  private testUser: TestUser;
  private adminUser: TestUser;
  private tokens: AuthTokens = { accessToken: '', refreshToken: '' };
  private adminTokens: AuthTokens = { accessToken: '', refreshToken: '' };

  constructor() {
    const timestamp = Date.now();
    this.testUser = {
      email: `test${timestamp}@example.com`,
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User'
    };

    this.adminUser = {
      email: `admin${timestamp}@example.com`,
      password: 'AdminPass123!',
      firstName: 'Admin',
      lastName: 'User'
    };
  }

  private log(message: string, data?: any) {
    console.log(`✓ ${message}`);
    if (data) {
      console.log(`  Response:`, JSON.stringify(data, null, 2));
    }
  }

  private logError(message: string, error: any) {
    console.error(`✗ ${message}`);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`  Error:`, error.message);
    }
  }

  private async makeRequest(method: string, url: string, data?: any, headers?: any) {
    try {
      const response = await axios({
        method,
        url: `${API_URL}${url}`,
        data,
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async testUserRegistration() {
    console.log('\n🔐 Testing User Registration...');
    
    try {
      const response = await this.makeRequest('POST', '/auth/register', this.testUser);
      this.log('User registration successful', {
        success: response.success,
        message: response.message,
        userId: response.data?.user?.id
      });
      return true;
    } catch (error) {
      this.logError('User registration failed', error);
      return false;
    }
  }

  async testUserLogin() {
    console.log('\n🔑 Testing User Login...');
    
    try {
      const response = await this.makeRequest('POST', '/auth/login', {
        email: this.testUser.email,
        password: this.testUser.password
      });

      this.tokens = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };

      this.log('User login successful', {
        success: response.success,
        message: response.message,
        hasTokens: !!(this.tokens.accessToken && this.tokens.refreshToken)
      });
      return true;
    } catch (error) {
      this.logError('User login failed', error);
      return false;
    }
  }

  async testGetCurrentUser() {
    console.log('\n👤 Testing Get Current User...');
    
    try {
      const response = await this.makeRequest('GET', '/auth/me', null, {
        Authorization: `Bearer ${this.tokens.accessToken}`
      });

      this.log('Get current user successful', {
        success: response.success,
        email: response.data?.user?.email,
        role: response.data?.user?.role
      });
      return true;
    } catch (error) {
      this.logError('Get current user failed', error);
      return false;
    }
  }

  async testTokenRefresh() {
    console.log('\n🔄 Testing Token Refresh...');
    
    try {
      const response = await this.makeRequest('POST', '/auth/refresh', {
        refreshToken: this.tokens.refreshToken
      });

      this.tokens.accessToken = response.data.accessToken;

      this.log('Token refresh successful', {
        success: response.success,
        message: response.message,
        hasNewToken: !!this.tokens.accessToken
      });
      return true;
    } catch (error) {
      this.logError('Token refresh failed', error);
      return false;
    }
  }

  async testPublicProductAccess() {
    console.log('\n📦 Testing Public Product Access...');
    
    try {
      const response = await this.makeRequest('GET', '/products');
      
      this.log('Public product access successful', {
        success: response.success,
        productCount: response.data?.products?.length || 0,
        totalPages: response.data?.totalPages
      });
      return true;
    } catch (error) {
      this.logError('Public product access failed', error);
      return false;
    }
  }

  async testProtectedProductAccess() {
    console.log('\n🔒 Testing Protected Product Access (Customer)...');
    
    try {
      // Try to create a product (should fail for regular user)
      await this.makeRequest('POST', '/products', {
        name: 'Test Product',
        type: 'Transparent',
        colorFamily: 'Blue',
        price: 25.99,
        sku: 'TEST-001'
      }, {
        Authorization: `Bearer ${this.tokens.accessToken}`
      });

      this.logError('Protected product access should have failed for customer', 'Unexpected success');
      return false;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        this.log('Protected product access correctly denied for customer', {
          status: error.response.status,
          message: error.response.data.message
        });
        return true;
      } else {
        this.logError('Protected product access failed with unexpected error', error);
        return false;
      }
    }
  }

  async testAdminRegistration() {
    console.log('\n👑 Testing Admin Registration...');
    
    try {
      // First register as regular user, then we'll manually promote to admin
      const response = await this.makeRequest('POST', '/auth/register', this.adminUser);
      this.log('Admin user registration successful', {
        success: response.success,
        userId: response.data?.user?.id
      });
      return true;
    } catch (error) {
      this.logError('Admin user registration failed', error);
      return false;
    }
  }

  async testInvalidCredentials() {
    console.log('\n❌ Testing Invalid Credentials...');
    
    try {
      await this.makeRequest('POST', '/auth/login', {
        email: this.testUser.email,
        password: 'WrongPassword123!'
      });

      this.logError('Invalid credentials test should have failed', 'Unexpected success');
      return false;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        this.log('Invalid credentials correctly rejected', {
          status: error.response.status,
          message: error.response.data.message
        });
        return true;
      } else {
        this.logError('Invalid credentials test failed with unexpected error', error);
        return false;
      }
    }
  }

  async testInvalidToken() {
    console.log('\n🚫 Testing Invalid Token...');
    
    try {
      await this.makeRequest('GET', '/auth/me', null, {
        Authorization: 'Bearer invalid-token-here'
      });

      this.logError('Invalid token test should have failed', 'Unexpected success');
      return false;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        this.log('Invalid token correctly rejected', {
          status: error.response.status,
          message: error.response.data.message
        });
        return true;
      } else {
        this.logError('Invalid token test failed with unexpected error', error);
        return false;
      }
    }
  }

  async testLogout() {
    console.log('\n🚪 Testing User Logout...');
    
    try {
      const response = await this.makeRequest('POST', '/auth/logout', null, {
        Authorization: `Bearer ${this.tokens.accessToken}`
      });

      this.log('User logout successful', {
        success: response.success,
        message: response.message
      });
      return true;
    } catch (error) {
      this.logError('User logout failed', error);
      return false;
    }
  }

  async testLoggedOutAccess() {
    console.log('\n🔐 Testing Access After Logout...');
    
    try {
      await this.makeRequest('GET', '/auth/me', null, {
        Authorization: `Bearer ${this.tokens.accessToken}`
      });

      this.logError('Access after logout should have failed', 'Unexpected success');
      return false;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        this.log('Access correctly denied after logout', {
          status: error.response.status,
          message: error.response.data.message
        });
        return true;
      } else {
        this.logError('Access after logout test failed with unexpected error', error);
        return false;
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Authentication Flow Tests...');
    console.log(`Testing against: ${API_URL}`);

    const tests = [
      { name: 'User Registration', test: () => this.testUserRegistration() },
      { name: 'User Login', test: () => this.testUserLogin() },
      { name: 'Get Current User', test: () => this.testGetCurrentUser() },
      { name: 'Token Refresh', test: () => this.testTokenRefresh() },
      { name: 'Public Product Access', test: () => this.testPublicProductAccess() },
      { name: 'Protected Product Access', test: () => this.testProtectedProductAccess() },
      { name: 'Admin Registration', test: () => this.testAdminRegistration() },
      { name: 'Invalid Credentials', test: () => this.testInvalidCredentials() },
      { name: 'Invalid Token', test: () => this.testInvalidToken() },
      { name: 'User Logout', test: () => this.testLogout() },
      { name: 'Access After Logout', test: () => this.testLoggedOutAccess() }
    ];

    let passed = 0;
    let failed = 0;

    for (const { name, test } of tests) {
      try {
        const result = await test();
        if (result) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`\n💥 Test "${name}" threw an error:`, error);
        failed++;
      }
    }

    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
      console.log('\n🎉 All authentication tests passed! Phase 2 is complete.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the authentication implementation.');
    }

    return failed === 0;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new AuthTester();
  tester.runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

export { AuthTester };