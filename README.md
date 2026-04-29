# 🎓 SAMS — Student Attendance Management System

A full-stack attendance management system built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

## Tech Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS v4, Recharts |
| 3D BG    | Three.js, React Three Fiber, Drei         |
| Backend  | Node.js, Express, Mongoose                |
| Database | MongoDB                                   |
| Auth     | JWT + bcryptjs                            |

## Features

- Role-based auth — Admin, Teacher, Student
- 3D animated starfield background with student-themed objects
- Student & Teacher management (CRUD)
- Class & Subject management
- Mark attendance (present / absent / late) per class/subject/date
- Attendance records with filters
- Reports & Analytics with charts + low attendance alerts
- CSV export
- System settings

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Clone & install

```bash
git clone https://github.com/AbiniveshMayilsamy/Student-Attendance-Management-System.git
cd Student-Attendance-Management-System
npm install
```

### 2. Setup backend

```bash
cd backend
npm install
cp .env.example .env   # edit MONGO_URI and JWT_SECRET
npm run seed           # seed demo data into MongoDB
npm run dev            # starts on http://localhost:5000
```

### 3. Setup frontend

```bash
# from root
cp .env.example .env
npm run dev            # starts on http://localhost:5173
```

## Demo Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@school.com       | admin123    |
| Teacher | teacher@school.com     | teacher123  |
| Student | student@school.com     | student123  |
