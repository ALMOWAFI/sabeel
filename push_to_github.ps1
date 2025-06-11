# PowerShell script to push to GitHub
# Run this script from PowerShell

# Navigate to the project directory
cd 'C:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel'

# Initialize Git repository if not already initialized
if (-not (Test-Path '.git')) {
    Write-Host "Initializing Git repository..."
    git init
}

# Configure Git user information
$name = Read-Host -Prompt "Enter your name for Git commits"
$email = Read-Host -Prompt "Enter your email for Git commits"
git config user.name $name
git config user.email $email

# Add remote repository if not already added
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host "Adding remote repository..."
    git remote add origin https://github.com/ALMOWAFI/sabeel.git
}

# Add all files to Git
Write-Host "Adding files to Git..."
git add .

# Commit changes
Write-Host "Committing changes..."
git commit -m "Initial commit"

# Push to GitHub
Write-Host "Pushing to GitHub..."
Write-Host "You will be prompted for your GitHub username and personal access token."
Write-Host "If you don't have a personal access token, create one at: https://github.com/settings/tokens"

# Push to the main branch
git push -u origin main

Write-Host "Done!"