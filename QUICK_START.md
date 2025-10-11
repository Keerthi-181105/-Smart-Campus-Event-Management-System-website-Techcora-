# 🚀 Quick Start Guide - Smart Campus System

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create a PostgreSQL database and update the DATABASE_URL in .env
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"

# Run database migrations
cd backend
npm run prisma:migrate

# Seed the database with sample data
npm run seed
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"
JWT_SECRET="your-super-secret-jwt-key"
APP_URL="http://localhost:5173"
```

### 4. Start the Application

```bash
# Start both backend and frontend (recommended)
npm run dev

# OR start them separately:
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 🔐 Login Credentials

### Admin Account

- **Email:** `admin@srmist.edu.in`
- **Password:** `admin123`

### Student Account

- **Email:** `student1@srmist.edu.in`
- **Password:** `student123`

### Organizer Account

- **Email:** `organizer1@srmist.edu.in`
- **Password:** `organizer123`

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **Login Page:** http://localhost:5173/login

## 📱 Features by Role

### 👨‍🎓 Student Features

- Browse events
- Register for events
- View registered events
- QR code check-in

### 👨‍💼 Organizer Features

- Create events
- Manage registrations
- View analytics
- Send notifications

### 👑 Admin Features

- All organizer features
- User management
- System analytics
- Full system control

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error**

   - Check your DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Run `npm run prisma:migrate` to create tables

2. **Login Fails**

   - Run `npm run seed` to create sample users
   - Check backend is running on port 4000
   - Check browser console for errors

3. **Frontend Not Loading**

   - Ensure frontend is running on port 5173
   - Check if backend API is accessible
   - Clear browser cache

4. **CORS Issues**
   - Backend should be running on port 4000
   - Frontend should be running on port 5173
   - Check API_URL in frontend configuration

## 📊 Sample Data

The seed script creates:

- 1 Admin user
- 2 Organizer users
- 5 Student users
- 10 Sample events across different categories

## 🔧 Development Commands

```bash
# Seed database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

## 📞 Support

If you encounter any issues, check:

1. All services are running
2. Database is properly seeded
3. Environment variables are set
4. Ports 4000 and 5173 are available
