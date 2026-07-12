#!/bin/bash
echo ""
echo "╔════════════════════════════════════════╗"
echo "║     CogniHire — AI Resume Screener  ║"
echo "║       Powered by Ollama (FREE)         ║"
echo "╚════════════════════════════════════════╝"
echo ""

if ! command -v ollama &> /dev/null; then
  echo "❌  Ollama not found! Install from: https://ollama.com"
  exit 1
fi

if ! curl -s http://localhost:11434 > /dev/null 2>&1; then
  echo "▶  Starting Ollama..."
  ollama serve &
  sleep 3
else
  echo "✅  Ollama already running"
fi

echo "▶  Pulling llama3 model (only needed once)..."
ollama pull llama3

echo ""
echo "▶  Setting up backend..."
cd backend
if [ ! -d "venv" ]; then python3 -m venv venv; fi
source venv/bin/activate
pip install -r requirements.txt -q
gunicorn app:application --bind 0.0.0.0:5000 &
BACKEND_PID=$!
cd ..

echo "▶  Setting up React frontend..."
cd frontend
if [ ! -d "node_modules" ]; then npm install; fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅  All running!"
echo "   Open → http://localhost:3000"
echo "   Ctrl+C to stop."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo Stopped." EXIT
wait
