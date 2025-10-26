# Deploying to Vercel

This guide will help you deploy your LLM security testing application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Groq API key (required)
- Reka AI API key (optional, for advanced classifiers)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the `app` folder as the root directory

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   - `GROQ_API_KEY`: Your Groq API key (required)
   - `REKA_API_KEY`: Your Reka AI API key (optional)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically detect the configuration and deploy both frontend and backend

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the app directory**
   ```bash
   cd app
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add GROQ_API_KEY
   vercel env add REKA_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Structure

```
app/
├── api/                  # Python serverless functions
│   └── test.py          # Main API endpoint
├── backend/             # Shared Python code
│   ├── groq_testing.py
│   └── generate_jailbreak_prompts.py
├── src/                 # React frontend
├── dist/                # Build output (auto-generated)
├── requirements.txt     # Python dependencies
├── vercel.json         # Vercel configuration
└── package.json        # Node.js dependencies
```

## How It Works

- **Frontend**: Built with Vite + React, deployed as static files
- **Backend**: Python serverless functions in the `/api` directory
- **API Route**: `/api/test` handles security testing requests
- **Environment Variables**: Automatically available to serverless functions

## Testing Locally

To test the deployment locally:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Link your project**
   ```bash
   cd app
   vercel link
   ```

3. **Pull environment variables**
   ```bash
   vercel env pull .env.local
   ```

4. **Run development server**
   ```bash
   vercel dev
   ```

This will start both the frontend and backend locally, simulating the Vercel environment.

## Troubleshooting

### Python Backend Not Working

1. **Check Environment Variables**: Ensure `GROQ_API_KEY` is set in Vercel dashboard
2. **Check Logs**: View function logs in Vercel dashboard under "Deployments" > "Functions"
3. **Check Requirements**: Ensure all Python dependencies are in `requirements.txt`

### Build Failures

1. **Check Build Logs**: View detailed build logs in Vercel dashboard
2. **Verify Node Version**: Ensure you're using a compatible Node.js version (18.x or later)
3. **Clear Cache**: Try redeploying with build cache cleared

### CORS Issues

The API functions are configured to allow CORS. If you still have issues:
- Check that requests are going to `/api/test` (relative path)
- Verify the API function is deployed correctly in Vercel dashboard

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | API key for Groq LLM service |
| `REKA_API_KEY` | No | API key for Reka AI (improves classifier accuracy) |

## Support

For issues specific to Vercel deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Support](https://vercel.com/docs/functions/serverless-functions/runtimes/python)

For application-specific issues, check the main README.
