# API Key Setup Instructions

## Required API Keys

To run the security tests, you need to configure the following API keys:

### 1. Groq API Key (Required)
- Go to [Groq Console](https://console.groq.com/keys)
- Sign up or log in to your account
- Create a new API key
- Copy the API key

### 2. Reka AI API Key (Optional)
- Go to [Reka AI](https://reka.ai/)
- Sign up or log in to your account
- Get your API key from the dashboard
- Copy the API key

## Configuration

1. Open `app/backend/config.env` file
2. Replace `your_groq_api_key_here` with your actual Groq API key
3. (Optional) Replace `your_reka_api_key_here` with your actual Reka AI API key
4. Save the file

Example:
```
GROQ_API_KEY=gsk_1234567890abcdef1234567890abcdef1234567890abcdef
REKA_API_KEY=rka_1234567890abcdef1234567890abcdef1234567890abcdef
```

## Running the Application

1. Start the backend:
   ```bash
   cd app/backend
   python groq_testing.py
   ```

2. Start the frontend:
   ```bash
   cd app
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## Troubleshooting

If you get "failed to run security tests. please check your api keys are configured":

1. Make sure you've set the API keys in `config.env`
2. Restart the backend server after changing the config
3. Check that the API keys are valid and have sufficient credits
4. Verify the `config.env` file is in the `app/backend/` directory
