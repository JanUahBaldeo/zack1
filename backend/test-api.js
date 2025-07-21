const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Mortgage Dashboard API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);

    // Test 2: API Info
    console.log('\n2. Testing API Info...');
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ API Info:', apiResponse.data.message);

    // Test 3: Auth Test Route
    console.log('\n3. Testing Auth Routes...');
    const authTestResponse = await axios.get(`${BASE_URL}/api/auth/test`);
    console.log('✅ Auth Test:', authTestResponse.data.message);

    console.log('\n🎉 All basic tests passed! API is working correctly.');
    console.log('\nNext steps:');
    console.log('- Set up your database connection in .env');
    console.log('- Run database migrations: npm run prisma:migrate');
    console.log('- Test registration: POST /api/auth/register');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('- Make sure the backend server is running on port 3001');
    console.log('- Check if .env file exists and is configured properly');
    console.log('- Verify all dependencies are installed: npm install');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;