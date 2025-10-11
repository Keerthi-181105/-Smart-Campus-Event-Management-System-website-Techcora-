# 🔐 Login Flow Test Guide

## Updated Login Redirection Logic

The login system now properly redirects users based on their role:

### ✅ **Student Login Flow**

- **Email:** `student1@srmist.edu.in`
- **Password:** `student123`
- **Expected Redirect:** `/student` → Student.tsx
- **Features:** Browse events, register for events, view QR codes

### ✅ **Admin Login Flow**

- **Email:** `admin@srmist.edu.in`
- **Password:** `admin123`
- **Expected Redirect:** `/organizer` → Organizer.tsx
- **Features:** Create events, manage events, view analytics

### ✅ **Organizer Login Flow**

- **Email:** `organizer1@srmist.edu.in`
- **Password:** `organizer123`
- **Expected Redirect:** `/organizer` → Organizer.tsx
- **Features:** Create events, manage events, view analytics

## 🧪 Testing Steps

### 1. Test Student Login

```bash
# 1. Start the application
npm run dev

# 2. Go to http://localhost:5173/login
# 3. Enter student credentials:
#    Email: student1@srmist.edu.in
#    Password: student123
# 4. Should redirect to /student (Student.tsx)
# 5. Should see "🎟 Student Dashboard" with event browsing
```

### 2. Test Admin Login

```bash
# 1. Go to http://localhost:5173/login
# 2. Enter admin credentials:
#    Email: admin@srmist.edu.in
#    Password: admin123
# 3. Should redirect to /organizer (Organizer.tsx)
# 4. Should see "Organizer Dashboard" with analytics
```

### 3. Test Organizer Login

```bash
# 1. Go to http://localhost:5173/login
# 2. Enter organizer credentials:
#    Email: organizer1@srmist.edu.in
#    Password: organizer123
# 3. Should redirect to /organizer (Organizer.tsx)
# 4. Should see "Organizer Dashboard" with analytics
```

## 🔍 Debug Information

The login process now includes detailed console logging:

```javascript
// Console output when logging in:
[auth] Login successful: { token: "...", role: "STUDENT", ... }
[auth] User role: STUDENT
[auth] Redirecting student to /student
```

## 📋 Expected Behavior

| Role      | Login Email              | Expected Redirect | Page Component |
| --------- | ------------------------ | ----------------- | -------------- |
| STUDENT   | student1@srmist.edu.in   | /student          | Student.tsx    |
| ADMIN     | admin@srmist.edu.in      | /organizer        | Organizer.tsx  |
| ORGANIZER | organizer1@srmist.edu.in | /organizer        | Organizer.tsx  |

## 🐛 Troubleshooting

### If Student Login Goes to Organizer Page:

1. Check browser console for role logging
2. Verify the user role in the database
3. Clear localStorage and try again

### If Admin Login Goes to Student Page:

1. Check if the role is properly set in the JWT token
2. Verify the backend is returning the correct role
3. Check the console logs for redirection messages

### If Login Fails:

1. Ensure the database is seeded: `npm run seed`
2. Check if backend is running on port 4000
3. Verify the API endpoint is accessible

## 🔧 Code Changes Made

### Updated Login.tsx:

```typescript
const role = (res.role || "STUDENT").toUpperCase();
console.info("[auth] User role:", role);

if (role === "STUDENT") {
  console.info("[auth] Redirecting student to /student");
  navigate("/student");
} else if (role === "ORGANIZER" || role === "ADMIN") {
  console.info("[auth] Redirecting organizer/admin to /organizer");
  navigate("/organizer");
} else {
  console.warn("[auth] Unknown role, defaulting to /student");
  navigate("/student");
}
```

This ensures:

- ✅ Students go to Student.tsx
- ✅ Admins go to Organizer.tsx
- ✅ Organizers go to Organizer.tsx
- ✅ Proper console logging for debugging
- ✅ Fallback handling for unknown roles
