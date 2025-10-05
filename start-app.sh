#!/bin/bash

# Censys Data Summarization Agent - Startup Script
echo "🚀 Starting Censys Data Summarization Agent..."

# Check if backend dependencies are installed
if [ ! -d "backend/__pycache__" ] && [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend not set up. Please run: cd backend && pip3 install -r requirements.txt"
    echo "   And make sure your .env file is configured with your OpenAI API key."
    exit 1
fi

# Start Flask backend in background
echo "🔧 Starting Flask backend on port 5001..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "⚛️  Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo "📊 Backend: http://127.0.0.1:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
