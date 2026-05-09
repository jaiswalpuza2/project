const axios = require('axios');

async function testChatbot() {
  try {
    console.log('Testing Chatbot Endpoint...');
    const response = await axios.post('http://localhost:5000/api/ai/chatbot', {
      message: 'Hello, help me find a job',
      context: 'Testing the backend connection'
    });
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Test Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

testChatbot();
