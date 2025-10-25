#!/bin/bash

echo "🚀 Starting Frontend Server..."
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    
    echo ""
    echo "✅ Dependencies installed"
    echo ""
fi

# Start Vite dev server
echo "🌐 Starting Vite dev server on http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev

