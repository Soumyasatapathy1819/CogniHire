# 🚀 CogniHire – AI-Powered Resume Screening System

CogniHire is an AI-powered resume screening platform that enables recruiters to evaluate and rank candidates intelligently using Large Language Models (LLMs). Built with **Flask**, **React**, and **Ollama**, the application analyzes resumes against a job description and generates detailed candidate insights while keeping all data completely local and private.

---

## 🎥 Demo

**Project Demonstration**

📹 **Watch the Demo Video:**  
https://drive.google.com/file/d/1FxKHiq6-03Zm0w8IflKErlzK3yxqMRL0/view?usp=sharing

---

## ✨ Features

- 📄 Upload multiple candidate resumes simultaneously
- 🤖 AI-powered resume evaluation using a local Large Language Model (LLM)
- 📝 Compare resumes against any Job Description (JD)
- 📊 Intelligent candidate ranking based on relevance
- ⭐ Resume matching score generation
- 💪 Candidate strengths identification
- ⚠️ Weakness and skill-gap analysis
- 💡 AI-generated hiring recommendations
- 📑 Automatic text extraction from multiple document formats
- 🔒 100% local processing using Ollama (No cloud upload)
- ⚡ Fast and responsive React interface

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Backend | Flask (Python) |
| AI Model | Ollama (Local LLM) |
| Language | Python, JavaScript |
| Resume Parsing | pdfplumber, pypdf, python-docx, docx2txt |
| Communication | REST API |

---

## 📁 Project Structure

```text
CogniHire/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── start.sh
├── start.bat
├── README.md
└── .gitignore
```

---

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

- Python 3.9 or above
- Node.js 18 or above
- npm
- Git
- Ollama

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/CogniHire.git
cd CogniHire
```

---

### 2️⃣ Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🤖 Install Ollama

Download and install Ollama from:

https://ollama.com/download

Verify the installation:

```bash
ollama --version
```

---

## 📥 Download the AI Model

Example:

```bash
ollama pull llama3.2
```

or

```bash
ollama pull mistral
```

Make sure the model name matches the one configured in **app.py**.

---

## ▶️ Start Ollama

```bash
ollama serve
```

Keep this terminal running while using the application.

---

## 🚀 Running the Project

### Option 1 (Recommended)

#### Windows

```bash
start.bat
```

#### Linux / macOS

```bash
chmod +x start.sh
./start.sh
```

---

### Option 2 (Manual)

#### Start the Backend

```bash
cd backend
python app.py
```

Backend runs at:

```
http://localhost:5000
```

---

#### Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## ⚙️ How It Works

```text
Upload Resume(s)
        │
        ▼
Extract Resume Text
        │
        ▼
Enter Job Description
        │
        ▼
LLM Analysis using Ollama
        │
        ▼
Resume Comparison
        │
        ▼
Candidate Ranking
        │
        ▼
AI Insights & Recommendations
```

---

## 📄 Supported File Formats

| File Type | Supported |
|-----------|-----------|
| PDF | ✅ |
| DOC | ✅ |
| DOCX | ✅ |
| TXT | ✅ |
| Markdown (.md) | ✅ |

---

## 📊 Output Includes

Each candidate receives:

- ✅ Resume Match Score
- ✅ AI Summary
- ✅ Skills Analysis
- ✅ Strengths
- ✅ Weaknesses
- ✅ Missing Skills
- ✅ Hiring Recommendation
- ✅ Candidate Ranking

---

## 🔒 Privacy

CogniHire runs completely on your local machine using **Ollama**.

This ensures:

- 🔒 No cloud processing
- 🔒 No data sharing
- 🔒 Offline functionality
- 🔒 Complete privacy
- 🔒 Secure resume analysis

---

## 🚀 Future Enhancements

- User Authentication
- Recruiter Dashboard
- Resume Database
- Candidate Search & Filters
- PDF/Excel Report Export
- Interview Question Generation
- ATS Compatibility Score
- Multi-LLM Support
- Email Notifications
- Analytics Dashboard

---

## 📸 Screenshots

Add screenshots here.

Example:

```text
screenshots/
├── Home.png
├── Upload.png
├── Results.png
└── Dashboard.png
```

Then insert them like this:

```markdown
### Home Page

![Home](screenshots/Home.png)

### Results

![Results](screenshots/Results.png)
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Soumya Prakash Satapathy**

B.Tech (Hons.) Computer Science & Engineering  
XIM University, Bhubaneswar

- GitHub: https://github.com/Soumyasatapathy1819
- LinkedIn: https://www.linkedin.com/in/soumya-prakash-satapathy/

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

**Made with ❤️ using Flask, React, and Ollama**