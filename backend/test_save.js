const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resume = require('./models/Resume');

dotenv.config();

const testSave = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const sampleData = {
      user: '69a3c40e855f75e2e2a900c4', 
      fullName: 'Puja Chaudhary',
      targetRole: 'Senior React Developer',
      summary: 'Experienced developer',
      skills: ['React', 'Node.js'],
      experience: [{ company: 'TechCorp', role: 'Web Dev', period: '2022-2024', desc: 'Built dashboards' }],
      education: [{ school: 'LMU', degree: 'CS', period: '2020-2023' }],
      projects: [{ name: 'JobSphere', description: 'Freelance platform', link: 'http://jobsphere.com' }]
    };

    console.log('Attempting to save...');
    const resume = new Resume(sampleData);
    await resume.save();
    console.log('Resume saved successfully:', resume._id);
    process.exit(0);
  } catch (err) {
    console.error('--- SAVE ERROR ---');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.errors) {
      console.error('Validation Errors:', JSON.stringify(err.errors, null, 2));
    }
    console.error('Stack Trace:', err.stack);
    process.exit(1);
  }
};

testSave();
