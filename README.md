🚀 CogniHire – AI-Powered Resume Screening System

CogniHire is an AI-powered resume screening platform that enables recruiters to evaluate and rank candidates intelligently using Large Language Models (LLMs). Built with Flask, React, and Ollama, the application analyzes resumes against a job description and generates detailed candidate insights while keeping all data completely local and private.

📌 Demo

🎥 Project Demonstration

Watch the Demo Video:
https://drive.google.com/file/d/1FxKHiq6-03Zm0w8IflKErlzK3yxqMRL0/view?usp=sharing

✨ Features
📄 Upload multiple candidate resumes simultaneously
🤖 AI-powered resume evaluation using a local LLM
📝 Compare resumes against any Job Description (JD)
📊 Intelligent candidate ranking based on relevance
⭐ Resume matching score generation
💪 Candidate strengths identification
⚠️ Weakness and skill-gap analysis
💡 AI-generated hiring recommendations
📑 Automatic text extraction from multiple document formats
🔒 100% local processing with Ollama (No cloud upload)
⚡ Fast and responsive React interface
🛠️ Tech Stack
Category	Technology
Frontend	React, Vite
Backend	Flask (Python)
AI Model	Ollama (Local LLM)
Language	Python, JavaScript
Resume Parsing	pdfplumber, pypdf, python-docx, docx2txt
Communication	REST API
📂 Project Structure
CogniHire/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── components/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── start.sh
├── start.bat
├── README.md
└── .gitignore
📋 Prerequisites

Before running the project, ensure you have the following installed:

Python 3.9+
Node.js 18+
npm
Git
Ollama
📦 Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/CogniHire.git

cd CogniHire
2️⃣ Install Backend Dependencies
cd backend

pip install -r requirements.txt
3️⃣ Install Frontend Dependencies
cd ../frontend

npm install
🤖 Install Ollama

Download Ollama from

https://ollama.com/download

Verify installation:

ollama --version
Pull the Required Model

Example:

ollama pull llama3.2

or

ollama pull mistral

Make sure the model name matches the one configured inside app.py.

Start Ollama
ollama serve

Keep this terminal running.

▶️ Running the Project
Option 1 (Recommended)

Windows

start.bat

Linux / macOS

chmod +x start.sh

./start.sh
Option 2 (Manual)
Start Backend
cd backend

python app.py

Backend runs on

http://localhost:5000
Start Frontend
cd frontend

npm run dev

Frontend runs on

http://localhost:5173
💻 How It Works
Upload Resume(s)
        │
        ▼
Extract Resume Text
        │
        ▼
Upload Job Description
        │
        ▼
LLM Analysis (Ollama)
        │
        ▼
Resume Comparison
        │
        ▼
Candidate Ranking
        │
        ▼
AI Generated Insights
📄 Supported File Formats
Format	Supported
PDF	✅
DOC	✅
DOCX	✅
TXT	✅
MD	✅
📊 Output Includes

Each candidate receives:

Overall Match Score
Resume Summary
Technical Skills Assessment
Strengths
Weaknesses
Missing Skills
Hiring Recommendation
Ranking Position
🔒 Privacy

Unlike many cloud-based ATS platforms, CogniHire performs all AI inference locally using Ollama.

This means:

✅ No resume data leaves your computer
✅ No cloud storage
✅ Better privacy
✅ Offline capability
✅ Secure candidate evaluation
🚀 Future Enhancements
Authentication & User Management
Recruiter Dashboard
Resume Database
Advanced Filtering
Export Results (PDF/Excel)
Interview Question Generation
Skill Gap Visualization
ATS Resume Score
Multi-Model LLM Support
Email Notification Integration