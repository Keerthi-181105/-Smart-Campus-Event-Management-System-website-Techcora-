# 🚨 "Failed to fetch" Login Error - Troubleshooting Guide

## 🔍 **Common Causes & Solutions**

### 1. **Backend Not Running**

**Problem:** The backend server isn't started, so the frontend can't connect to the API.

**Solution:**

```bash
# Check if backend is running
cd smart-campus-system/backend
npm run dev

# Should see output like:
# API listening on http://localhost:4000
# [env] DATABASE_URL set: true
# [env] JWT_SECRET set: true
```

### 2. **Missing Environment Variables**

**Problem:** Backend doesn't have required environment variables.

**Solution:** Create `.env` file in `smart-campus-system/backend/`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"
JWT_SECRET="your-super-secret-jwt-key-here"
APP_URL="http://localhost:5173"
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
```

### 3. **Database Not Connected**

**Problem:** Backend can't connect to the database.

**Solution:**

```bash
# Install and start PostgreSQL
# Then run database setup:
cd smart-campus-system/backend
npm run prisma:migrate
npm run seed
```

### 4. **CORS Issues**

**Problem:** Frontend and backend are on different ports and CORS isn't configured.

**Solution:** The backend already has CORS configured, but ensure both are running:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### 5. **API URL Configuration**

**Problem:** Frontend is trying to connect to wrong API URL.

**Solution:** Check the API configuration in `frontend/src/lib/api.ts`:

```typescript
// Should default to http://localhost:4000
const baseUrl =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";
```

## 🛠️ **Step-by-Step Fix**

### Step 1: Check Backend Status

```bash
# Navigate to backend directory
cd smart-campus-system/backend

# Check if dependencies are installed
npm install

# Start the backend
npm run dev
```

**Expected Output:**

```
API listening on http://localhost:4000
[env] DATABASE_URL set: true
[env] JWT_SECRET set: true
```

### Step 2: Create Environment File

Create `smart-campus-system/backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_campus"
JWT_SECRET="your-super-secret-jwt-key-here"
APP_URL="http://localhost:5173"
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
```

### Step 3: Setup Database

```bash
# Run database migrations
npm run prisma:migrate

# Seed the database with sample users
npm run seed
```

### Step 4: Test Backend API

```bash
# Test if backend is responding
curl http://localhost:4000/api/health

# Should return: {"status":"ok"}
```

### Step 5: Start Frontend

```bash
# In a new terminal, navigate to frontend
cd smart-campus-system/frontend

# Install dependencies if needed
npm install

# Start the frontend
npm run dev
```

### Step 6: Test Login

1. Go to `http://localhost:5173/login`
2. Use credentials:
   - Email: `student1@srmist.edu.in`
   - Password: `student123`
3. Check browser console for any errors

## 🔧 **Quick Fix Commands**

### Complete Setup (Run these in order):

```bash
# 1. Setup backend
cd smart-campus-system/backend
npm install
npm run prisma:migrate
npm run seed
npm run dev

# 2. Setup frontend (in new terminal)
cd smart-campus-system/frontend
npm install
npm run dev
```

### Alternative: Use Docker

```bash
# If you have Docker installed
cd smart-campus-system
docker-compose up
```

## 🐛 **Debug Information**

### Check Browser Console

Open browser DevTools (F12) and look for:

- Network errors in Console tab
- Failed requests in Network tab
- CORS errors

### Check Backend Logs

Look for these messages in backend terminal:

- `API listening on http://localhost:4000`
- `[env] DATABASE_URL set: true`
- `[env] JWT_SECRET set: true`

### Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:4000/api/health

# Test login endpoint
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@srmist.edu.in","password":"student123"}'
```

## 📞 **Still Having Issues?**

### Common Error Messages:

1. **"Failed to fetch"**

   - Backend not running
   - Wrong API URL
   - CORS issues

2. **"Network Error"**

   - Backend not accessible
   - Firewall blocking connection

3. **"CORS error"**

   - Frontend/backend port mismatch
   - CORS configuration issue

4. **"Database connection failed"**
   - PostgreSQL not running
   - Wrong DATABASE_URL
   - Database doesn't exist

### Quick Verification:

```bash
# Check if ports are in use
netstat -an | grep :4000  # Backend
netstat -an | grep :5173  # Frontend

# Check if processes are running
ps aux | grep node
```

## 🎯 **Expected Working State**

When everything is working:

1. Backend running on `http://localhost:4000`
2. Frontend running on `http://localhost:5173`
3. Database seeded with sample users
4. Login redirects properly based on role
5. No console errors in browser
