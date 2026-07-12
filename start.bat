@echo off
echo.
echo ========================================
echo   CogniHire - AI Resume Screener
echo ========================================
echo.

REM -- Check for Python
where python >nul 2>&1
if errorlevel 0 (
    set "PYCMD=python"
) else (
    where py >nul 2>&1
    if errorlevel 0 (
        set "PYCMD=py -3"
    ) else (
        echo ERROR: Python not found. Install from python.org & pause & exit
        pause & exit /b 1
    )
)

REM -- Check for Node
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Install from nodejs.org & pause & exit
    pause & exit /b 1
)

REM -- Check for Ollama but don't fail if missing
where ollama >nul 2>&1
if errorlevel 1 (
    echo WARNING: Ollama not found. Local analyzer fallback will be used.
    set "HAS_OLLAMA=0"
) else (
    set "HAS_OLLAMA=1"
)

if "%HAS_OLLAMA%"=="1" (
    echo [1/5] Pulling llama3 model (only needed once)...
    ollama pull llama3
    echo [2/5] Starting Ollama server...
    start "Ollama" cmd /k "ollama serve"
    timeout /t 3 /nobreak >nul
) else (
    echo [1/5] Skipping Ollama setup (not installed).
)

echo [3/5] Setting up Python backend (using %PYCMD%)...
cd backend
if not exist venv (
    echo Creating virtual environment...
    %PYCMD% -m venv venv
)
call venv\Scripts\activate.bat
echo Installing Python dependencies (this may take a minute)...
python -m pip install -r requirements.txt
echo Starting backend with Gunicorn on http://localhost:5000
start "Flask Backend" cmd /k "call venv\Scripts\activate.bat && gunicorn app:application --bind 0.0.0.0:5000"
cd ..

echo [4/5] Setting up React frontend...
cd frontend
if not exist node_modules (
    echo Installing npm packages...
    npm install
)
echo Starting React (Vite)...
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅  All systems starting (or using local fallbacks where necessary).
echo.
echo    Open your browser: http://localhost:3000 (or the port Vite prints)
echo.
echo    Note: First analysis may take 1-2 mins while models load if Ollama is used.
echo.
pause
