# GitHub Upload Instructions

Follow these steps to upload your Sabeel project to GitHub:

## Step 1: Create a Personal Access Token (PAT)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give your token a descriptive name (e.g., "Sabeel Project Upload")
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (if you plan to use GitHub Actions)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately and save it somewhere secure. You won't be able to see it again!

## Step 2: Run the PowerShell Script

1. Open PowerShell as Administrator
2. Navigate to your project directory:
   ```
   cd 'C:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel'
   ```
3. Run the script:
   ```
   .\push_to_github.ps1
   ```
4. Follow the prompts to enter your name and email
5. When prompted for your GitHub credentials:
   - Username: Your GitHub username
   - Password: Use the personal access token you created in Step 1

## Step 3: Verify the Upload

1. Go to your GitHub repository: https://github.com/ALMOWAFI/sabeel
2. Refresh the page to see your uploaded files

## Troubleshooting

If you encounter any issues:

1. **Authentication Failed**: Make sure you're using your personal access token as the password, not your GitHub account password.

2. **Permission Denied**: Ensure your personal access token has the correct scopes (permissions).

3. **Error with Path**: If you get path-related errors, try running these commands individually:
   ```
   git init
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   git remote add origin https://github.com/ALMOWAFI/sabeel.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

4. **Branch Issues**: If pushing to `main` doesn't work, try `master` instead:
   ```
   git push -u origin master
   ```

## Alternative: GitHub Desktop

If you continue to have issues with the command line:

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Add your local repository (File > Add local repository)
4. Browse to `C:\Users\Aliel\OneDrive - Constructor University\Desktop\sabeel`
5. Publish your repository to GitHub