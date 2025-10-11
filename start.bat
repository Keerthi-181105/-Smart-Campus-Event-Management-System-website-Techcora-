@echo off
echo 🚀 Starting Smart Campus System...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the smart-campus-system directory
    pause
    exit /b 1
)

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"
        echo.
        echo # JWT Secret for authentication
        echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
        echo.
        echo # Application URL
        echo APP_URL="http://localhost:5173"
        echo.
        echo # CORS Origins ^(comma-separated^)
        echo CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
        echo.
        echo # Server Port
        echo PORT=4000
    ) > backend\.env
    echo ✅ Created backend/.env file
)

REM Install dependencies
echo 📦 Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

REM Setup database
echo 🗄️ Setting up database...
cd backend
call npm run prisma:migrate
call npm run seed
cd ..

echo ✅ Setup complete!
echo.
echo 🔧 To start the application:
echo 1. Terminal 1 - Backend: cd backend ^&^& npm run dev
echo 2. Terminal 2 - Frontend: cd frontend ^&^& npm run dev
echo.
echo 🌐 Then visit: http://localhost:5173/login
echo.
echo 🔐 Login credentials:
echo Student: student1@srmist.edu.in / student123
echo Admin: admin@srmist.edu.in / admin123
echo Organizer: organizer1@srmist.edu.in / organizer123
echo.
pause
