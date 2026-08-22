import { collection, doc } from 'firebase/firestore';
import { db } from './config';

/**
 * Dayflow Firestore Collection Schema Definitions
 * 
 * 1. users/{uid}
 *    - employeeId: string
 *    - fullName: string
 *    - email: string
 *    - role: "admin" | "employee"
 *    - phone: string
 *    - address: string
 *    - profilePictureUrl: string
 *    - jobTitle: string
 *    - department: string
 *    - dateJoined: string (ISO / YYYY-MM-DD)
 * 
 * 2. attendance/{docId}
 *    - employeeId: string
 *    - date: string (YYYY-MM-DD)
 *    - checkIn: string (e.g. "09:15 AM")
 *    - checkOut: string (e.g. "06:30 PM")
 *    - status: "present" | "absent" | "half-day" | "leave"
 * 
 * 3. leaveRequests/{docId}
 *    - employeeId: string
 *    - leaveType: "paid" | "sick" | "unpaid"
 *    - startDate: string (YYYY-MM-DD)
 *    - endDate: string (YYYY-MM-DD)
 *    - remarks: string
 *    - status: "pending" | "approved" | "rejected"
 *    - adminComment: string
 *    - reviewedBy: string (admin uid or name)
 *    - createdAt: string | timestamp
 * 
 * 4. payroll/{docId}
 *    - employeeId: string
 *    - baseSalary: number
 *    - allowances: number | object
 *    - deductions: number | object
 *    - effectiveFrom: string (YYYY-MM-DD)
 *    - updatedBy: string (admin uid)
 * 
 * 5. documents/{docId}
 *    - employeeId: string
 *    - fileName: string
 *    - filePath: string
 *    - uploadedAt: string | timestamp
 * 
 * 6. mail/{docId} (Trigger Email Extension)
 *    - to: string | string[]
 *    - message: { subject: string, text: string, html: string }
 *    - createdAt: string | timestamp
 */

export const COLLECTIONS = {
  USERS: 'users',
  ATTENDANCE: 'attendance',
  LEAVE_REQUESTS: 'leaveRequests',
  PAYROLL: 'payroll',
  DOCUMENTS: 'documents',
  MAIL: 'mail',
};

// Firestore Collection References
export const usersCol = collection(db, COLLECTIONS.USERS);
export const attendanceCol = collection(db, COLLECTIONS.ATTENDANCE);
export const leaveRequestsCol = collection(db, COLLECTIONS.LEAVE_REQUESTS);
export const payrollCol = collection(db, COLLECTIONS.PAYROLL);
export const documentsCol = collection(db, COLLECTIONS.DOCUMENTS);
export const mailCol = collection(db, COLLECTIONS.MAIL);

// Helpers for specific document refs
export const userDocRef = (uid) => doc(db, COLLECTIONS.USERS, uid);
export const attendanceDocRef = (docId) => doc(db, COLLECTIONS.ATTENDANCE, docId);
export const leaveRequestDocRef = (docId) => doc(db, COLLECTIONS.LEAVE_REQUESTS, docId);
export const payrollDocRef = (docId) => doc(db, COLLECTIONS.PAYROLL, docId);
export const documentDocRef = (docId) => doc(db, COLLECTIONS.DOCUMENTS, docId);
export const mailDocRef = (docId) => doc(db, COLLECTIONS.MAIL, docId);
