@echo off
echo Sabeel GitHub Upload Script
echo ===========================
echo.

echo Navigating to project directory...
cd /d "C:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel"

echo.
echo Initializing Git repository...
git init

echo.
set /p name="Enter your name for Git commits: "
set /p email="Enter your email for Git commits: "
git config user.name "%name%"
git config user.email "%email%"

echo.
echo Adding remote repository...
git remote add origin https://github.com/ALMOWAFI/sabeel.git

echo.
echo Adding files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Initial commit"

echo.
echo Pushing to GitHub...
echo You will be prompted for your GitHub username and personal access token.
echo If you don't have a personal access token, create one at: https://github.com/settings/tokens
echo.

git push -u origin main

echo.
echo Done!
pause