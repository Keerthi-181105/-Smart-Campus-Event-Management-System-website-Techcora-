#!/bin/bash

# Smart Campus System Startup Script
echo "🚀 Starting Smart Campus System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the smart-campus-system directory"
    exit 1
fi

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application URL
APP_URL="http://localhost:5173"

# CORS Origins (comma-separated)
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"

# Server Port
PORT=4000
EOF
    echo "✅ Created backend/.env file"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install
cd ..

# Setup database
echo "🗄️ Setting up database..."
cd backend
npm run prisma:migrate
npm run seed
cd ..

echo "✅ Setup complete!"
echo ""
echo "🔧 To start the application:"
echo "1. Terminal 1 - Backend: cd backend && npm run dev"
echo "2. Terminal 2 - Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Then visit: http://localhost:5173/login"
echo ""
echo "🔐 Login credentials:"
echo "Student: student1@srmist.edu.in / student123"
echo "Admin: admin@srmist.edu.in / admin123"
echo "Organizer: organizer1@srmist.edu.in / organizer123"
