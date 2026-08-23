# Dayflow HRMS

> **A modern, full-stack Human Resource Management System** built for the Odoo Hackathon — managing employees, attendance, leaves, payroll, and reports under one roof.

🌐 **Live Demo:** [https://dayflow-odoo-hrms.netlify.app](https://dayflow-odoo-hrms.netlify.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Firebase Architecture](#-firebase-architecture)
- [Screens & Roles](#-screens--roles)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Security](#-security)

---

## 🌟 Overview

**Dayflow** is a role-based HRMS platform with two distinct user experiences:

| Role | Access |
|---|---|
| **Employee** | View own profile, mark attendance, apply for leave, view payroll & reports |
| **HR Admin** | Full control — manage all employees, approve/reject leaves, edit payroll, view org-wide reports |

All data is real-time and persisted in **Firebase Firestore**. Authentication is handled by **Firebase Auth**. The app is deployed and hosted on **Netlify**.

---

## ✨ Features

### 🔐 Authentication
- Email & Password **Sign Up** with Employee ID, Full Name, and Role selection (Employee / HR Admin)
- **Sign In** with inline error handling for invalid credentials and too-many-attempts lockout
- Role-based routing — admins go to `/admin/dashboard`, employees go to `/dashboard`
- Password strength validation (min 8 chars, 1 number, 1 special character)
- Persistent session via Firebase Auth state observer

### 👤 Profile Management
- **Employee** — view their own profile card (name, employee ID, department, job title, date joined)
- **Employee Edit** — can update phone number, address, and profile picture only
- **Admin** — can view and fully edit any employee's profile (all fields)
- Avatars auto-generated via DiceBear API as a default, replaceable with a custom URL
- Profile data synced to Firestore `users/{uid}` collection

### 📅 Attendance
- Daily **Check In / Check Out** with timestamps written to Firestore
- Status badges: `Present`, `Absent`, `Half-Day`, `Leave`
- **Employee view** — sees only their own daily and weekly attendance history
- **Admin view** — sees all employees' attendance with an employee filter dropdown
- Prevents double check-in on the same day

### 🏖️ Leave Management
- **Leave Apply** — employee selects leave type (Paid / Sick / Unpaid), date range, and remarks
- Leave request is created in Firestore with `status: "pending"`
- **Admin Leave Approvals** — loads all pending requests, can Approve or Reject with a comment
- Status update is real-time — employee sees the change immediately on their next view
- **Email alert** — when a leave is approved or rejected, an automated email is sent to the employee via the Firestore `mail` collection (Firebase Trigger Email extension)

### 💰 Payroll
- **Employee view** — read-only view of their payroll doc: base salary, allowances, deductions, and net pay
- **Admin view** — can load and edit any employee's payroll record
- Payroll data stored in Firestore `payroll/{docId}`, keyed by employee UID

### 📊 Reports
- **Attendance Summary** — percentage of present days for the selected month, per employee (admin) or self (employee)
- **Salary Slips table** — lists all payroll records with employee name, department, base salary, deductions, and net pay
- **CSV Export** — download attendance or payroll reports as `.csv` files directly from the browser
- Admin sees org-wide data; employee sees only their own

### 👥 Employee Directory (Admin Only)
- Paginated list of all employees with name, department, job title, and status
- Quick link to edit any employee's profile
- Search and filter support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Vite 8** | Lightning-fast dev server and build tool |
| **React Router DOM v7** | Client-side navigation and role-based routing |
| **Vanilla CSS** | Custom design system with CSS variables, no frameworks |
| **Custom SVG Icon Library** | Hand-crafted `Icons.jsx` component — no emoji, no icon packs |

### Backend & Infrastructure
| Technology | Purpose |
|---|---|
| **Firebase Auth** | Email/password authentication, session persistence |
| **Firebase Firestore** | NoSQL real-time database for all app data |
| **Firebase Trigger Email** | Automated email notifications on leave status change |
| **Netlify** | Hosting, CI/CD, SPA redirect rules, environment variable management |

### Tooling
| Tool | Purpose |
|---|---|
| **Oxlint** | Fast JavaScript linter |
| **Git + GitHub** | Version control and source of truth for Netlify deployments |

---

## 📁 Project Structure

```
odoo-hackathon/
├── public/
│   └── _redirects              # Netlify SPA routing rule (/* → /index.html)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Icons.jsx       # Custom SVG icon component library
│   │   └── layout/
│   │       ├── Sidebar.jsx     # Role-aware navigation sidebar
│   │       ├── Sidebar.css
│   │       └── TopBar.jsx      # Top header bar
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state — user, profile, role
│   ├── data/
│   │   └── mockData.js         # Fallback mock data (legacy, mostly unused)
│   ├── firebase/
│   │   ├── config.js           # Firebase app initialization
│   │   ├── schema.js           # Firestore doc ref helpers
│   │   ├── authService.js      # signUpUser, signInUser, logoutUser
│   │   ├── userService.js      # fetchAllEmployees, updateUserProfile
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   ├── payrollService.js
│   │   └── emailService.js     # Writes to mail collection to trigger emails
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── employee/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileView.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── LeaveApply.jsx
│   │   │   ├── Payroll.jsx
│   │   │   └── Reports.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── EmployeeList.jsx
│   │       ├── ProfileEdit.jsx
│   │       ├── LeaveApprovals.jsx
│   │       └── Payroll.jsx
│   ├── styles/                 # Global CSS design tokens and utilities
│   ├── App.jsx                 # Route definitions for employee + admin
│   └── main.jsx                # React entry point
├── .env                        # Firebase keys (git-ignored)
├── .env.example                # Placeholder env file (committed)
├── firestore.rules             # Firestore security rules
├── netlify.toml                # Netlify build config
└── package.json
```

---

## 🔥 Firebase Architecture

### Collections

#### `users/{uid}`
```
employeeId        string   — e.g. "EMP-001"
fullName          string
email             string
role              string   — "admin" | "employee"
phone             string
address           string
profilePictureUrl string
jobTitle          string
department        string
dateJoined        string   — "YYYY-MM-DD"
```

#### `attendance/{docId}`
```
employeeId  string
date        string   — "YYYY-MM-DD"
checkIn     string   — ISO timestamp
checkOut    string   — ISO timestamp
status      string   — "present" | "absent" | "half-day" | "leave"
```

#### `leaveRequests/{docId}`
```
employeeId   string
leaveType    string   — "paid" | "sick" | "unpaid"
startDate    string
endDate      string
remarks      string
status       string   — "pending" | "approved" | "rejected"
adminComment string
reviewedBy   string
createdAt    string
```

#### `payroll/{docId}`
```
employeeId    string
baseSalary    number
allowances    number
deductions    number
effectiveFrom string
updatedBy     string
```

#### `mail/{docId}` *(Firebase Trigger Email extension)*
```
to      string   — recipient email address
message {
  subject  string
  html     string
}
```

### Security Rules Summary

- **Signed-in users only** can read/write their own `users` doc
- **Admins** can read and write any document in any collection
- **Employees** can only read their own attendance, leave, and payroll records
- **Employees** can create new leave requests but cannot modify status directly
- `mail` collection is write-only for authenticated users (read blocked for everyone)

---

## 📱 Screens & Role Matrix

| Screen | Employee | HR Admin |
|---|---|---|
| Sign Up / Sign In | ✅ | ✅ |
| Employee Dashboard | ✅ | — |
| Admin Dashboard | — | ✅ |
| Profile View | Own only | Any employee |
| Profile Edit | Phone / Address / Photo | All fields, any employee |
| Attendance | Own history + check-in/out | All employees + filter by employee |
| Leave Apply | ✅ | — |
| Leave Approvals | — | ✅ Approve / Reject with comment |
| Payroll | Own (read-only) | Any employee (editable) |
| Reports + CSV Export | Own stats | Org-wide stats |
| Employee Directory | — | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Firestore** and **Authentication (Email/Password)** enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/viswajithpanduga1607/odoo-hackathon.git
cd odoo-hackathon

# Install dependencies
npm install

# Copy the env template and fill in your Firebase keys
cp .env.example .env

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# Output goes to dist/
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ `.env` is in `.gitignore` and is never committed. Only `.env.example` is tracked.

---

## 🌐 Deployment

This project is deployed on **Netlify** with the following configuration:

**`netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

**`public/_redirects`** — ensures React Router handles all client-side routes:
```
/*  /index.html  200
```

All `VITE_FIREBASE_*` environment variables are configured in the **Netlify site settings → Environment variables** panel — never stored in the repository.

Deployments trigger automatically on every push to the `main` branch via GitHub → Netlify CI/CD integration.

---

## 🔒 Security

- Firebase API keys are stored only in environment variables (`.env` locally, Netlify env vars in production)
- Firestore Security Rules enforce role-based access at the **database level** — frontend checks are a UX layer only
- `.env` is git-ignored and was explicitly untracked from Git history
- Passwords are hashed and managed entirely by **Firebase Auth** — never stored by the app
- The `mail` collection triggers emails server-side via the Firebase Trigger Email extension — no email credentials are ever exposed to the client

---

## 👨‍💻 Built For

**Odoo Hackathon** — a sprint to build a production-ready HRMS from scratch.

---

*Made with ❤️ using React 19, Firebase, and Netlify*
