const { spawn } = require('child_process');

console.log(' Starting JobSphere Backend and Frontend...');

const backend = spawn('npm', ['run', 'dev'], { 
  cwd: 'backend', 
  shell: true, 
  stdio: 'inherit' 
});

const frontend = spawn('npm', ['run', 'dev'], { 
  cwd: 'frontend', 
  shell: true, 
  stdio: 'inherit' 
});

backend.on('error', (err) => console.error('Backend process error:', err));
frontend.on('error', (err) => console.error('Frontend process error:', err));

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
