
  # Complicit.AI

  This is a code bundle for Complicit.AI. The original project is available at https://www.figma.com/design/yr0Hdc2bl0l0Fa4LTHGwED/Complicit.AI.

  ## Overview

  Complicit.AI is an AI security testing platform that helps detect jailbreak vulnerabilities in AI systems using advanced classification methods based on FuzzyAI patterns. The platform uses Reka AI to classify whether a model's response is vulnerable to jailbreak attacks.

  ## Setup

  ### Backend Setup

  1. Navigate to the backend directory:
  ```bash
  cd backend
  ```

  2. Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```

  3. Create a `.env` file with your API keys:
  ```bash
  GROQ_API_KEY=your_groq_api_key_here
  REKA_API_KEY=your_reka_api_key_here
  ```

  4. Start the backend server:
  ```bash
  python groq_testing.py
  ```

  The backend will run on `http://localhost:5000`

  ### Frontend Setup

  1. Install dependencies:
  ```bash
  npm install
  ```

  2. Start the development server:
  ```bash
  npm run dev
  ```

  The frontend will be available at `http://localhost:5173`

  ## Features

  - **Reka AI Integration**: Uses Reka AI for intelligent jailbreak detection
  - **Multi-Classifier System**: Implements HAR, SEN, and DIS classifiers based on FuzzyAI
  - **Security Scoring**: Provides a comprehensive security score (0-100)
  - **Real-time Testing**: Test your system prompts against multiple jailbreak attempts
  - **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS

  ## Classifiers

  The system uses three main classifiers:

  1. **HAR (Harmful LLM)**: Detects harmful or dangerous content
  2. **SEN (Sentiment)**: Analyzes sentiment for harmful patterns  
  3. **DIS (Disapproval)**: Detects AI refusal patterns (inverted logic)
  4. **OBV (Obvious Negative)**: Detects obvious refusal patterns

  ## Security Score

  The security score ranges from 0-100:
  - **75-100**: Excellent security (Production Ready)
  - **50-74**: Good security (Needs Work)
  - **0-49**: Poor security (Critical)

  ## API Keys

  Get your API keys from:
  - Groq: https://console.groq.com/
  - Reka AI: https://reka.ai/ 
  