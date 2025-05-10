// Simplified test file to check if Node.js is working properly
console.log('Node.js environment test');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Test if we can access basic Node.js functionality
try {
  const fs = require('fs');
  console.log('Successfully loaded fs module');
  
  // List files in current directory
  try {
    const files = fs.readdirSync('.');
    console.log('Files in current directory:', files.slice(0, 5), '...');
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
  
  // Check if package.json exists and read it
  try {
    if (fs.existsSync('./package.json')) {
      const packageJson = fs.readFileSync('./package.json', 'utf8');
      const pkg = JSON.parse(packageJson);
      console.log('Package name:', pkg.name);
      console.log('Dependencies count:', Object.keys(pkg.dependencies || {}).length);
    } else {
      console.log('package.json not found in current directory');
    }
  } catch (err) {
    console.error('Error processing package.json:', err.message);
  }
} catch (err) {
  console.error('Error loading modules:', err.message);
}

console.log('Test completed');