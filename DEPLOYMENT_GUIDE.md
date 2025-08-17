# Gemini Quiz Quest - Vercel Deployment Guide

## Prerequisites

1. **GitHub Account** - You'll need a GitHub repository for your code
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com)
4. **Firebase Project** (Optional) - For authentication in production

## Part 1: Prepare Your Project for Deployment

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `gemini-quiz-quest` or similar
3. Make it **public** (free Vercel deployments require public repos)
4. Don't initialize with README (we'll push existing code)

### Step 2: Initialize Git and Push Your Code

Open command prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Gemini Quiz Quest app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Replace** `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details.

### Step 3: Prepare Environment Variables

Create a `.env.example` file to document required environment variables:

```
VITE_API_KEY=your_gemini_api_key_here
```

**Important**: Never commit your actual `.env.local` file with real API keys!

## Part 2: Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Select your `gemini-quiz-quest` repository

### Step 2: Configure Build Settings

Vercel should automatically detect this is a Vite React app. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

In the Vercel deployment screen:

1. Expand **"Environment Variables"** section
2. Add your environment variable:
   - **Name**: `VITE_API_KEY`
   - **Value**: Your actual Google Gemini API key
   - **Environment**: Production (check this box)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-3 minutes)
3. You'll get a live URL like `https://your-project-name.vercel.app`

## Part 3: Verify Deployment

1. Visit your live URL
2. Test both quiz and flashcard functionality
3. Check browser console for any errors
4. Verify API calls are working with your Gemini key

## Part 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Domains"** tab
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

---

# Knowledge Base Update Guide via GitHub

## Overview

Your app's questions and flashcards are generated from the knowledge base file located at:
`public/knowledge-base.json`

## Method 1: Direct GitHub Editing (Easiest)

### Step 1: Navigate to the File
1. Go to your GitHub repository
2. Click on `public` folder
3. Click on `knowledge-base.json`

### Step 2: Edit the File
1. Click the **pencil icon** (Edit this file)
2. Make your changes to the JSON structure
3. Add new topics, facts, or modify existing content

### Step 3: Commit Changes
1. Scroll to bottom of page
2. Add commit message like: "Add new Water cycle content"
3. Click **"Commit changes"**
4. Your Vercel deployment will **automatically rebuild** within 30 seconds!

## Method 2: Local Development + Push

### Step 1: Pull Latest Changes
```bash
git pull origin main
```

### Step 2: Edit Knowledge Base
1. Open `public/knowledge-base.json` in your code editor
2. Add new content following the existing structure
3. Save the file

### Step 3: Test Locally
```bash
npm run dev
```
Test your new content in the app.

### Step 4: Commit and Push
```bash
git add public/knowledge-base.json
git commit -m "Update knowledge base with new content"
git push origin main
```

Vercel will automatically deploy your changes!

## Knowledge Base Structure Explained

```json
{
  "subjects": {
    "science": {
      "topics": ["Materie", "Water", "Lug"],
      "content": {
        "Materie": {
          "facts": [
            "Fact about matter [source reference]"
          ],
          "definitions": {
            "term": "definition"
          }
        }
      }
    }
  }
}
```

### Adding New Topics

1. Add topic name to the `topics` array
2. Create new section under `content` with the topic name
3. Add `facts` array and `definitions` object

### Adding New Facts

Simply add strings to the `facts` array for any topic. Include source references in square brackets.

### Adding New Definitions

Add key-value pairs to the `definitions` object where:
- **Key**: The term being defined
- **Value**: The definition

## Automatic Deployment

Every time you push changes to your main branch on GitHub:
1. Vercel detects the changes
2. Automatically rebuilds your app
3. Updates your live site within 1-2 minutes
4. You'll get an email confirmation when deployment completes

## Monitoring Your App

### Vercel Dashboard
- View deployment logs
- Monitor performance
- See visitor analytics
- Check error reports

### Build Logs
If deployment fails:
1. Go to Vercel dashboard
2. Click on failed deployment
3. Check build logs for errors
4. Common issues: missing environment variables, TypeScript errors

## Troubleshooting

### Common Issues

1. **"API key not found" error**:
   - Verify `VITE_API_KEY` is set in Vercel environment variables
   - Ensure API key is valid in Google AI Studio

2. **Build fails**:
   - Check TypeScript errors in build logs
   - Verify all dependencies are in package.json

3. **App loads but features don't work**:
   - Check browser console for JavaScript errors
   - Verify knowledge-base.json is valid JSON

4. **Changes not reflecting**:
   - Allow 1-2 minutes for Vercel deployment
   - Hard refresh browser (Ctrl+F5)
   - Check Vercel dashboard for deployment status

### Getting Help

- Check Vercel deployment logs first
- GitHub repository Issues tab for app-specific problems
- Vercel documentation for platform issues

## Security Notes

- Never commit real API keys to your repository
- Use environment variables for all sensitive data
- Your `.env.local` file is already gitignored (safe)
- Knowledge base content is public (stored in `public/` folder)

---

**Your app is now ready for the world! 🚀**

Every update you make will automatically deploy to your live site.