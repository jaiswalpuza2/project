const axios = require('axios');
const AUTH_URL = 'http://localhost:5000/api/auth';
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING UNIT TESTS ---');

 
  let freelancerToken;
  try {
    console.log('\n[UT01] Testing User Login (Freelancer)...');
    const loginRes = await axios.post(`${AUTH_URL}/login`, {
      email: 'lalitajaiswal455@gmail.com',
      password: 'lalita@123'
    });
    freelancerToken = loginRes.data.token;
    console.log('Result: PASS');
    console.log('Output:', loginRes.data.user.name);
  } catch (err) {
    console.log('Result: FAIL');
    console.error('Error:', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\n[UT02] Testing Registration...');
    const randomSuffix = Math.floor(Math.random() * 10000);
    const signupRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Test Unit User',
      email: `unit_test_${randomSuffix}@gmail.com`,
      password: 'password123',
      role: 'freelancer'
    });
    console.log('Result: PASS');
    console.log('Output:', signupRes.data.message);
  } catch (err) {
    console.log('Result: FAIL');
    console.error('Error:', err.response ? err.response.data : err.message);
  }


  let employerToken;
  let jobId;
  try {
    console.log('\n[UT03] Testing Job Posting (Employer)...');
    const loginRes = await axios.post(`${AUTH_URL}/login`, {
      email: 'employeet357@gmail.com',
      password: 'test@123'
    });
    employerToken = loginRes.data.token;
    
    const jobRes = await axios.post(`${API_URL}/jobs`, {
      title: 'Senior Frontend Developer (Unit Test ' + Date.now() + ')',
      description: 'Test job description',
      skillsRequired: ['React', 'Node.js'],
      budget: 500,
      category: 'Web Development'
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    jobId = jobRes.data.data._id;
    console.log('Result: PASS');
    console.log('Output - Job ID:', jobId);
  } catch (err) {
    console.log('Result: FAIL');
    console.error('Error:', err.response ? err.response.data : err.message);
  }

  
  try {
    console.log('\n[UT04] Testing Application Retrieval (Employer)...');
    if (!jobId) {

      const jobsRes = await axios.get(`${API_URL}/jobs`, {
        params: { employer: 'employeet357@gmail.com' } 
      });
      jobId = jobsRes.data.data[0]?._id;
    }
    
    if (jobId) {
      const appRes = await axios.get(`${API_URL}/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      console.log('Result: PASS');
      console.log('Output - Application Count:', appRes.data.count);
    } else {
      console.log('Result: FAIL');
      console.log('Error: No job ID available for test');
    }
  } catch (err) {
    console.log('Result: FAIL');
    console.error('Error:', err.response ? err.response.data : err.message);
  }


  try {
    console.log('\n[UT05] Testing Messaging Retrieval (Freelancer)...');
    const chatRes = await axios.get(`${API_URL}/chat/contacts`, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    console.log('Result: PASS');
    console.log('Output - Contacts Count:', chatRes.data.length);
  } catch (err) {
    console.log('Result: FAIL');
    console.error('Error:', err.response ? err.response.data : err.message);
  }

  console.log('\n--- UNIT TESTS COMPLETED ---');
}

runTests();
