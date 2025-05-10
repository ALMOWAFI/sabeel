// Minimal test file to check if Node.js is working properly
console.log('Node.js environment test');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Test if we can access basic Node.js functionality
try {
  const fs = require('fs');
  console.log('Successfully loaded fs module');
  
  // Try to read package.json
  try {
    const packageJson = fs.readFileSync('./package.json', 'utf8');
    console.log('Successfully read package.json');
  } catch (err) {
    console.error('Error reading package.json:', err.message);
  }
} catch (err) {
  console.error('Error loading modules:', err.message);
}

console.log('Test completed');