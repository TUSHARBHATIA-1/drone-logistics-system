const axios = require('axios');

/**
 * Basic Backend Health & API Test Script
 * Run with: node backend/tests/smoke-test.js
 */

const BASE_URL = 'http://localhost:5000/api';

async function runSmokeTest() {
    console.log('--- Starting System Smoke Test ---');
    
    try {
        // 1. Health Check
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Backend Health:', health.data.status);

        // 2. Auth Check (Example)
        console.log('ℹ️ Manual Step: Register and Login via Frontend or Postman to obtain JWT.');
        
        // 3. Drone Monitoring Check
        console.log('ℹ️ Note: Further automated tests require a valid JWT in headers.');
        
        console.log('--- Smoke Test Preliminary Phase Complete ---');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

runSmokeTest();
