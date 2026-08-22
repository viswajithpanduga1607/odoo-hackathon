import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { leaveRequestsCol, leaveRequestDocRef } from './schema';

/**
 * Apply for leave
 */
export async function applyForLeave({
  uid,
  profile = {},
  leaveType,
  startDate,
  endDate,
  remarks = '',
  days = 1,
}) {
  if (!uid) throw new Error('User UID is required');
  if (!startDate || !endDate) throw new Error('Start date and end date are required');

  const normalizedType = (leaveType || 'paid').toLowerCase().replace(' leave', '');
  const validTypes = ['paid', 'sick', 'unpaid'];
  const finalType = validTypes.includes(normalizedType) ? normalizedType : 'paid';

  const leaveDocData = {
    employeeId: uid,
    employeeDisplayId: profile.employeeId || '',
    employeeName: profile.fullName || 'Employee',
    avatar: profile.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.fullName || uid)}`,
    leaveType: finalType,
    startDate,
    endDate,
    days: Number(days) || 1,
    remarks: remarks?.trim() || '',
    status: 'pending', // "pending" | "approved" | "rejected"
    adminComment: '',
    reviewedBy: '',
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(leaveRequestsCol, leaveDocData);
  return { id: docRef.id, ...leaveDocData };
}

/**
 * Fetch leave requests for a single employee
 */
export async function fetchEmployeeLeaveRequests(uid) {
  if (!uid) return [];
  const q = query(leaveRequestsCol, where('employeeId', '==', uid));
  const snap = await getDocs(q);
  const requests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return requests.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/**
 * Fetch all leave requests (Admin only)
 */
export async function fetchAllLeaveRequests() {
  const snap = await getDocs(leaveRequestsCol);
  const requests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return requests.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/**
 * Review leave request (Approve / Reject) (Admin only)
 */
export async function reviewLeaveRequest(docId, { status, adminComment = '', adminName = 'Admin' }) {
  if (!docId) throw new Error('Leave request ID is required');
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status. Must be "approved" or "rejected".');
  }

  const updateData = {
    status,
    adminComment: adminComment?.trim() || '',
    reviewedBy: adminName,
    reviewedAt: new Date().toISOString(),
  };

  await updateDoc(leaveRequestDocRef(docId), updateData);
  return { success: true, ...updateData };
}
