# 🚀 Backend Setup Guide - Fix "Failed to fetch" Error

## 📋 **Quick Fix Steps**

### 1. **Create Environment File**

Create a file named `.env` in `smart-campus-system/backend/` with this content:

```env
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
```

### 2. **Install Dependencies**

```bash
cd smart-campus-system/backend
npm install
```

### 3. **Setup Database**

```bash
# Run database migrations
npm run prisma:migrate

# Seed the database with sample users
npm run seed
```

### 4. **Start Backend**

```bash
npm run dev
```

**Expected Output:**

```
API listening on http://localhost:4000
[env] DATABASE_URL set: true
[env] JWT_SECRET set: true
```

### 5. **Test Backend**

Open a new terminal and test:

```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok"}`

### 6. **Start Frontend**

In a new terminal:

```bash
cd smart-campus-system/frontend
npm install
npm run dev
```

### 7. **Test Login**

1. Go to `http://localhost:5173/login`
2. Use credentials:
   - Email: `student1@srmist.edu.in`
   - Password: `student123`

## 🔧 **Alternative: Use Docker**

If you have Docker installed:

```bash
cd smart-campus-system
docker-compose up
```

## 🐛 **Common Issues & Solutions**

### Issue: "Database connection failed"

**Solution:** Install and start PostgreSQL, then update DATABASE_URL in .env

### Issue: "Port 4000 already in use"

**Solution:**

```bash
# Kill process using port 4000
npx kill-port 4000
# Or change PORT in .env to 4001
```

### Issue: "CORS error"

**Solution:** Ensure CORS_ORIGINS in .env includes your frontend URL

### Issue: "JWT_SECRET not set"

**Solution:** Make sure JWT_SECRET is set in .env file

## ✅ **Verification Checklist**

- [ ] Backend running on port 4000
- [ ] Frontend running on port 5173
- [ ] Database connected and seeded
- [ ] No console errors in browser
- [ ] Login redirects properly

## 📞 **Still Having Issues?**

1. Check browser console (F12) for specific error messages
2. Verify backend is running: `curl http://localhost:4000/api/health`
3. Check if ports are available: `netstat -an | grep :4000`
4. Ensure all dependencies are installed: `npm install` in both directories
