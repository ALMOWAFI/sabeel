#!/usr/bin/env node

/**
 * Manual component organization script for Sabeel
 * 
 * Since this project uses ESM modules, we'll create a script that outputs the commands
 * that you should manually run to organize the components instead of automating everything.
 */

// Define the component categories
const layoutComponents = [
  'Footer.tsx',
  'Navbar.tsx',
];

const patternComponents = [
  'CallToAction.tsx',
  'ForWho.tsx',
  'Hero.tsx',
  'KeyFeatures.tsx',
  'Vision.tsx',
  'LanguageSwitcher.tsx',
  'ErrorBoundary.tsx',
  'NodeDetailPanel.tsx',
];

const featureComponents = [
  'HadithSearch.tsx',
  'IslamicCMS.tsx',
  'IslamicCalendar.tsx',
  'IslamicCourses.tsx',
  'IslamicResources.tsx',
  'KnowledgeExplorer.tsx',
  'KnowledgeGraph.tsx',
  'QiblaFinder.tsx',
  'QuranExplorer.tsx',
  'ResearchCollaboration.tsx',
  'RobustKnowledgeExplorer.tsx',
  'SabeelChatbot.tsx',
  'SabeelSettings.tsx',
  'ScholarDashboard.tsx',
  'ScholarDirectory.tsx',
  'ScholarForum.tsx',
  'SimpleKnowledgeExplorer.tsx',
  'TrendingTopics.tsx',
];

// Print instructions
console.log('===== Sabeel Component Organization Guide =====');
console.log('\nRun these commands to organize your components:\n');

console.log('# 1. Copy layout components')
layoutComponents.forEach(component => {
  console.log(`Copy-Item src/components/${component} src/components/layouts/${component}`);
});

console.log('\n# 2. Copy pattern components');
patternComponents.forEach(component => {
  console.log(`Copy-Item src/components/${component} src/components/patterns/${component}`);
});

console.log('\n# 3. Copy feature components');
featureComponents.forEach(component => {
  console.log(`Copy-Item src/components/${component} src/components/features/${component}`);
});

console.log('\n# 4. Create index files');
console.log(`
# For layouts
$layoutContent = @'
${layoutComponents.map(comp => `export { default as ${comp.replace('.tsx', '')} } from './${comp.replace('.tsx', '')}';`).join('\n')}
'@
$layoutContent | Out-File -FilePath src/components/layouts/index.ts -Encoding utf8

# For patterns
$patternContent = @'
${patternComponents.map(comp => `export { default as ${comp.replace('.tsx', '')} } from './${comp.replace('.tsx', '')}';`).join('\n')}
'@
$patternContent | Out-File -FilePath src/components/patterns/index.ts -Encoding utf8

# For features
$featureContent = @'
${featureComponents.map(comp => `export { default as ${comp.replace('.tsx', '')} } from './${comp.replace('.tsx', '')}';`).join('\n')}
'@
$featureContent | Out-File -FilePath src/components/features/index.ts -Encoding utf8
`);

console.log('\n===== Component Organization Instructions Complete =====');
console.log('Run these commands in your PowerShell terminal to organize the components');
console.log('Then update your imports to use the new organized structure.')
