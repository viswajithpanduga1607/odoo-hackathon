import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { leaveRequestsCol, leaveRequestDocRef, userDocRef } from './schema';
import { sendLeaveStatusEmailTrigger } from './emailService';

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
    employeeEmail: profile.email || '',
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
 * Updates status in Firestore and triggers an email notification to the employee
 */
export async function reviewLeaveRequest(docId, { status, adminComment = '', adminName = 'Admin' }) {
  if (!docId) throw new Error('Leave request ID is required');
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status. Must be "approved" or "rejected".');
  }

  // Get current leave request details for email alert
  const reqSnap = await getDoc(leaveRequestDocRef(docId));
  const currentData = reqSnap.exists() ? reqSnap.data() : {};

  const updateData = {
    status,
    adminComment: adminComment?.trim() || '',
    reviewedBy: adminName,
    reviewedAt: new Date().toISOString(),
  };

  // Update in Firestore
  await updateDoc(leaveRequestDocRef(docId), updateData);

  // Trigger Email Alert
  try {
    let employeeEmail = currentData.employeeEmail;
    let employeeName = currentData.employeeName || 'Employee';

    // If employee email wasn't on the request doc, fetch from users/{employeeId}
    if (!employeeEmail && currentData.employeeId) {
      const userSnap = await getDoc(userDocRef(currentData.employeeId));
      if (userSnap.exists()) {
        const udata = userSnap.data();
        employeeEmail = udata.email;
        employeeName = udata.fullName || employeeName;
      }
    }

    if (employeeEmail) {
      await sendLeaveStatusEmailTrigger({
        employeeEmail,
        employeeName,
        status,
        startDate: currentData.startDate || 'N/A',
        endDate: currentData.endDate || 'N/A',
        days: currentData.days || 1,
        adminComment: adminComment || '',
        leaveRequestId: docId,
      });
    }
  } catch (emailErr) {
    console.error('Email alert trigger error (non-fatal):', emailErr);
  }

  return { success: true, ...updateData };
}
