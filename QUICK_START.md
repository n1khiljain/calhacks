# Quick Start Guide

## Issue: Nothing happens when clicking "Run Security Tests" button

The most common reason is that **the backend server is not running**. Follow these steps:

## Step 1: Install Backend Dependencies

Open a terminal in the `backend` directory and run:

```bash
cd backend
pip install -r requirements.txt
```

This installs Flask, Flask-CORS, Groq, python-dotenv, and requests.

## Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# In backend/.env
GROQ_API_KEY=your_groq_api_key_here
REKA_API_KEY=your_reka_api_key_here
```

Get your API keys from:
- Groq: https://console.groq.com/
- Reka AI: https://reka.ai/

**Note:** The app will work without Reka AI (using fallback classifiers), but you need Groq API key.

## Step 3: Start the Backend Server

In the `backend` directory, run:

```bash
python groq_testing.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

**Keep this terminal window open** - the backend needs to keep running.

## Step 4: Start the Frontend

Open a **NEW** terminal window and run:

```bash
cd app
npm install  # Only needed the first time
npm run dev
```

## Step 5: Test the Application

1. Open your browser to the URL shown (usually `http://localhost:5173`)
2. Click "Test Your Product"
3. Enter a system prompt (or click one of the examples)
4. Click "Run Security Tests"

## Troubleshooting

### "Network Error" or "Failed to fetch"
- **Backend is not running** - Go back to Step 3
- Backend running on wrong port - Make sure it's on port 5000

### "The button does nothing"
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click the button again
4. Check for error messages

### "MODULE_NOT_FOUND" or "No module named 'flask'"
- You need to install backend dependencies - Go back to Step 1

### "Cannot find module" errors in frontend
- Run `npm install` in the `app` directory

## Checking if Backend is Running

To verify the backend is working, open this URL in your browser:

```
http://localhost:5000/
```

If the backend is running, you'll see a response. If not, you'll get a connection error.

## Quick Test (Without Frontend)

You can also test the backend directly using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"system_prompt": "You are a helpful assistant."}'
```

If this returns JSON, your backend is working correctly!

## Need Help?

Check the browser console (F12) for detailed error messages. The most common issues are:

1. Backend not running
2. Missing API keys (for Groq)
3. CORS errors (now fixed with flask-cors)
4. Frontend not installed (`npm install`)
