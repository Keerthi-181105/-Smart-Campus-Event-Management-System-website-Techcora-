# Smart Campus System - Login Credentials

## Sample Login Accounts

### 🔐 **Admin Account**

- **Email:** `admin@srmist.edu.in`
- **Password:** `admin123`
- **Role:** ADMIN
- **Access:** Full system access, can manage all events and users

### 👨‍💼 **Organizer Accounts**

- **Email:** `organizer1@srmist.edu.in`
- **Password:** `organizer123`
- **Role:** ORGANIZER
- **Access:** Can create and manage events

- **Email:** `organizer2@srmist.edu.in`
- **Password:** `organizer123`
- **Role:** ORGANIZER
- **Access:** Can create and manage events

### 👨‍🎓 **Student Accounts**

- **Email:** `student1@srmist.edu.in`
- **Password:** `student123`
- **Role:** STUDENT
- **Access:** Can browse and register for events

- **Email:** `student2@srmist.edu.in`
- **Password:** `student123`
- **Role:** STUDENT
- **Access:** Can browse and register for events

- **Email:** `student3@srmist.edu.in`
- **Password:** `student123`
- **Role:** STUDENT
- **Access:** Can browse and register for events

- **Email:** `student4@srmist.edu.in`
- **Password:** `student123`
- **Role:** STUDENT
- **Access:** Can browse and register for events

- **Email:** `student5@srmist.edu.in`
- **Password:** `student123`
- **Role:** STUDENT
- **Access:** Can browse and register for events

## How to Use

1. **Start the application:**

   ```bash
   # Start backend
   cd smart-campus-system/backend
   npm run dev

   # Start frontend (in another terminal)
   cd smart-campus-system/frontend
   npm run dev
   ```

2. **Seed the database:**

   ```bash
   cd smart-campus-system
   npm run seed
   ```

3. **Login to the system:**
   - Go to `http://localhost:5173/login`
   - Use any of the credentials above
   - The system will automatically redirect you based on your role:
     - **STUDENT** → `/student` dashboard (Student.tsx)
     - **ADMIN/ORGANIZER** → `/organizer` dashboard (Organizer.tsx)

## Features by Role

### 🎯 **Student Features**

- Browse all available events
- Register for events
- View registered events
- Receive notifications
- QR code check-in

### 🎪 **Organizer Features**

- Create new events
- Manage event details
- View registrations
- Analytics dashboard
- Send notifications

### 👑 **Admin Features**

- All organizer features
- User management
- System analytics
- Event moderation
- Full system control

## Security Notes

- All passwords are properly hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control is implemented
- All API endpoints are protected with authentication middleware

## Troubleshooting

If you encounter any issues:

1. **Database not seeded:** Run `npm run seed` in the project root
2. **Backend not running:** Check if the backend is running on port 4000
3. **Frontend not running:** Check if the frontend is running on port 5173
4. **Login fails:** Ensure the database is properly seeded with the sample users

## API Endpoints

- **Login:** `POST /api/auth/login`
- **Get Profile:** `GET /api/auth/me`
- **Forgot Password:** `POST /api/auth/forgot-password`
- **Reset Password:** `POST /api/auth/reset-password`
