// Debug script to test Vercel build environment
console.log('=== VERCEL BUILD DEBUG ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());

// Check if all required dependencies are available
const requiredPackages = [
  'vite',
  'react',
  'react-dom',
  '@vitejs/plugin-react'
];

requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} - Available`);
  } catch (error) {
    console.log(`❌ ${pkg} - Missing: ${error.message}`);
  }
});

console.log('=== END DEBUG ==='); 