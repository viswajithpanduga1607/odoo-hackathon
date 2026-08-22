import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { attendanceCol, attendanceDocRef } from './schema';

/**
 * Format current time to 12-hour format: "09:15 AM"
 */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date to YYYY-MM-DD
 */
export function getTodayDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculate duration between check-in time and check-out time
 */
export function calculateDuration(checkInStr, checkOutStr) {
  try {
    const today = getTodayDateString();
    const d1 = new Date(`${today} ${checkInStr}`);
    const d2 = new Date(`${today} ${checkOutStr}`);
    const diffMs = d2 - d1;
    if (isNaN(diffMs) || diffMs <= 0) return '0h 0m';
    const mins = Math.floor(diffMs / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  } catch {
    return '-';
  }
}

/**
 * Fetch today's attendance record for a user
 */
export async function getTodayAttendanceRecord(uid) {
  if (!uid) return null;
  const today = getTodayDateString();
  const q = query(
    attendanceCol,
    where('employeeId', '==', uid),
    where('date', '==', today)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Check In user
 */
export async function checkInUser(uid, profile = {}) {
  if (!uid) throw new Error('User UID is required');
  const today = getTodayDateString();
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const checkInTime = formatTime(now);

  const existing = await getTodayAttendanceRecord(uid);
  if (existing) {
    throw new Error('Already checked in for today');
  }

  // Document ID can be deterministic per day: `${uid}_${today}`
  const docId = `${uid}_${today}`;
  const record = {
    employeeId: uid,
    employeeDisplayId: profile.employeeId || '',
    employeeName: profile.fullName || 'Employee',
    date: today,
    day: dayName,
    checkIn: checkInTime,
    checkOut: '-',
    hours: '-',
    status: 'present',
    createdAt: new Date().toISOString(),
  };

  await setDoc(attendanceDocRef(docId), record);
  return { id: docId, ...record };
}

/**
 * Check Out user
 */
export async function checkOutUser(docId, checkInTime) {
  if (!docId) throw new Error('Attendance document ID is required');
  const now = new Date();
  const checkOutTime = formatTime(now);
  const duration = calculateDuration(checkInTime, checkOutTime);

  const updateData = {
    checkOut: checkOutTime,
    hours: duration,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(attendanceDocRef(docId), updateData);
  return { success: true, checkOut: checkOutTime, hours: duration };
}

/**
 * Fetch attendance history for a specific employee
 */
export async function fetchEmployeeAttendance(uid) {
  if (!uid) return [];
  const q = query(
    attendanceCol,
    where('employeeId', '==', uid)
  );
  const snap = await getDocs(q);
  const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort by date descending
  return records.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

/**
 * Fetch all attendance records (Admin only)
 */
export async function fetchAllAttendance(filterEmployeeId = null) {
  let q;
  if (filterEmployeeId && filterEmployeeId !== 'All') {
    q = query(attendanceCol, where('employeeId', '==', filterEmployeeId));
  } else {
    q = attendanceCol;
  }
  const snap = await getDocs(q);
  const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return records.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
