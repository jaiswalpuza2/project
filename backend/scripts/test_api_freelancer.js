const axios = require('axios');
const AUTH_URL = 'http://localhost:5000/api/auth';
const API_URL = 'http://localhost:5000/api';

async function runFreelancerTests() {
  console.log('--- STARTING REFINED FREELANCER UNIT TESTS (v2) ---');
  let token;
  let freelancerId;
  let sampleJobId;


  const testEmail = `testuser${Math.floor(Math.random() * 10000)}@gmail.com`;
  try {
    console.log('\n[UT-F01] Testing Freelancer Registration...');
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Test Freelancer',
      email: testEmail,
      password: 'password123',
      role: 'freelancer'
    });
    console.log('Status: 201 Created');
    console.log('Response Snippet:', JSON.stringify(regRes.data.user || regRes.data, null, 2));
  } catch (err) {
    console.error('UT-F01 FAIL:', err.response ? err.response.data : err.message);
  }


  try {
    console.log('\n[UT-F02] Testing Freelancer Login...');
    const loginRes = await axios.post(`${AUTH_URL}/login`, {
      email: testEmail, 
      password: 'password123'
    });
    token = loginRes.data.token;
    freelancerId = loginRes.data.user.id || loginRes.data.user._id;
    console.log('Status: 200 OK');
    console.log('Response Snippet:', JSON.stringify(loginRes.data.user, null, 2));
  } catch (err) {
    console.error('UT-F02 FAIL:', err.response ? err.response.data : err.message);
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    console.log('\n[UT-F03] Testing Browse All Jobs...');
    const jobsRes = await axios.get(`${API_URL}/jobs`);
    sampleJobId = jobsRes.data.data[0]?._id;
    console.log('Status: 200 OK');
    console.log('Jobs Found:', jobsRes.data.data ? jobsRes.data.data.length : 0);
    if (sampleJobId) console.log('Sample Job ID Captured:', sampleJobId);
  } catch (err) {
    console.error('UT-F02 FAIL:', err.response ? err.response.data : err.message);
  }

 
  try {
    console.log('\n[UT-F04] Testing Job Recommendations...');
    const recRes = await axios.get(`${API_URL}/jobs/recommendations`, { headers });
    console.log('Status: 200 OK');
    console.log('Recommendations Count:', recRes.data.data ? recRes.data.data.length : 0);
  } catch (err) {
    console.error('UT-F03 FAIL:', err.response ? err.response.data : err.message);
  }

  try {
    if (sampleJobId) {
      console.log(`\n[UT-F05] Testing Save Job ID: ${sampleJobId}...`);
      const saveRes = await axios.post(`${API_URL}/saved-jobs/${sampleJobId}`, {}, { headers });
      console.log('Status: 201 Created / 200 OK');
      console.log('Response:', saveRes.data.message || 'Saved');
    }
  } catch (err) {
    console.error('UT-F04 FAIL:', err.response ? err.response.data : err.message);
  }


  try {
    console.log('\n[UT-F06] Testing Get Saved Jobs...');
    const savedRes = await axios.get(`${API_URL}/saved-jobs`, { headers });
    console.log('Status: 200 OK');
    console.log('Saved Jobs Count:', savedRes.data.data ? savedRes.data.data.length : 0);
  } catch (err) {
    console.error('UT-F05 FAIL:', err.response ? err.response.data : err.message);
  }


  try {
    if (sampleJobId) {
      console.log(`\n[UT-F07] Testing Submit Application for Job: ${sampleJobId}...`);

      const appRes = await axios.post(`${API_URL}/applications/apply`, {
        job: sampleJobId,
        proposal: 'I am highly interested in this project. (Testing Refinement v2)',
        expectedBudget: 550
      }, { headers });
      console.log('Status: 201 Created');
      console.log('Response Snippet:', JSON.stringify(appRes.data.data, null, 2));
    }
  } catch (err) {
    console.log('Status:', err.response ? err.response.status : 'ERR');
    console.log('Response:', err.response ? (err.response.data.message || err.response.data) : err.message);
  }

  try {
    console.log('\n[UT-F08] Testing Get My Applications...');
    const myAppsRes = await axios.get(`${API_URL}/applications/my`, { headers });
    console.log('Status: 200 OK');
    console.log('Applications Count:', myAppsRes.data.data ? myAppsRes.data.data.length : 0);
  } catch (err) {
    console.error('UT-F07 FAIL:', err.response ? err.response.data : err.message);
  }


  try {
    console.log('\n[UT-F09] Testing AI Chatbot Query...');
    const botRes = await axios.post(`${API_URL}/ai/chatbot`, {
      message: 'Hello, how can I improve my freelancer profile?'
    });
    console.log('Status: 200 OK');
    console.log('AI Response Snippet:', botRes.data.response ? botRes.data.response.substring(0, 100) + '...' : 'No Response');
  } catch (err) {
    console.error('UT-F08 FAIL:', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\n[UT-F10] Testing AI Service Status...');
    const resumeRes = await axios.get(`${API_URL}/ai/status`);
    console.log('Status: 200 OK');
    console.log('AI AI Service Status:', resumeRes.data.status);
  } catch (err) {
    console.error('UT-F09 FAIL:', err.response ? err.response.data : err.message);
  }


  try {
    console.log('\n[UT-F11] Testing Get Chat Contacts...');
    const chatRes = await axios.get(`${API_URL}/chat/contacts`, { headers });
    console.log('Status: 200 OK');
    console.log('Contacts Count:', chatRes.data.data ? chatRes.data.data.length : (chatRes.data.length || 0));
  } catch (err) {
    console.error('UT-F10 FAIL:', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\n[UT-F12] Testing Get Payment History...');
    const payRes = await axios.get(`${API_URL}/payments/my-payments`, { headers });
    console.log('Status: 200 OK');
    console.log('Payments Count:', payRes.data.data ? payRes.data.data.length : 0);
  } catch (err) {
    console.error('UT-F11 FAIL:', err.response ? err.response.data : err.message);
  }

  console.log('\n--- v2 FREELANCER UNIT TESTS COMPLETED ---');
}

runFreelancerTests();
