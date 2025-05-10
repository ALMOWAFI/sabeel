// prepare-deploy.js
// Script to create a minimal deployment package
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a deployment directory
const deployDir = path.join(__dirname, 'deploy-package');
if (fs.existsSync(deployDir)) {
  console.log('Cleaning existing deployment directory...');
  fs.rmSync(deployDir, { recursive: true, force: true });
}

// Create the directory structure
fs.mkdirSync(deployDir, { recursive: true });
fs.mkdirSync(path.join(deployDir, 'public'), { recursive: true });
fs.mkdirSync(path.join(deployDir, 'src'), { recursive: true });

// Copy essential files
console.log('Copying essential files...');

// Copy package.json (without dev dependencies)
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const deployPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: packageJson.type,
  dependencies: packageJson.dependencies,
  scripts: {
    build: packageJson.scripts.build,
    preview: packageJson.scripts.preview
  }
};
fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(deployPackageJson, null, 2)
);

// Copy configuration files
const configFiles = [
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  '.env.example'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(deployDir, file));
  }
});

// Copy source files recursively
console.log('Copying source files...');
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Skip node_modules and other non-essential directories
    if (entry.isDirectory()) {
      if ([
        'node_modules', 
        '.git', 
        'appwrite', 
        'coverage', 
        'dist',
        'build',
        'scripts',
        'migrations',
        '__tests__'
      ].includes(entry.name)) {
        continue;
      }
      
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      copyDir(srcPath, destPath);
    } else {
      // Skip test files, large assets, etc.
      if (
        entry.name.endsWith('.test.ts') || 
        entry.name.endsWith('.test.tsx') ||
        entry.name.endsWith('.spec.ts') ||
        entry.name.endsWith('.spec.tsx') ||
        entry.name.includes('.git') ||
        ['.DS_Store', 'Thumbs.db'].includes(entry.name)
      ) {
        continue;
      }
      
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.error(`Error copying ${srcPath}: ${err.message}`);
      }
    }
  }
};

// Copy src directory
copyDir(path.join(__dirname, 'src'), path.join(deployDir, 'src'));

// Copy public directory (only essential assets)
const publicSrc = path.join(__dirname, 'public');
const publicDest = path.join(deployDir, 'public');
if (fs.existsSync(publicSrc)) {
  copyDir(publicSrc, publicDest);
}

console.log('Deployment package created at:', deployDir);

// Count files (Windows-compatible way)
let totalFiles = 0;
const countFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      countFiles(fullPath);
    } else {
      totalFiles++;
    }
  }
};

countFiles(deployDir);
console.log('Total files in deployment package:', totalFiles);

console.log('\nTo deploy, run:');
console.log('cd deploy-package');
console.log('npm install --production');
console.log('npm run build');
console.log('netlify deploy --prod   # if you have Netlify CLI installed');
