import { doc, getDoc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import { usersCol, userDocRef } from './schema';

/**
 * Fetch a single user profile by UID
 */
export async function fetchUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(userDocRef(uid));
  if (snap.exists()) {
    return { id: snap.id, uid: snap.id, ...snap.data() };
  }
  return null;
}

/**
 * Fetch all registered users / employees (Admin operation)
 */
export async function fetchAllEmployees() {
  try {
    const q = query(usersCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
  } catch (err) {
    // If createdAt index isn't ready or missing, fallback to simple query
    const snap = await getDocs(usersCol);
    return snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
  }
}

/**
 * Update employee self profile:
 * Security rules allow employee to update only ['phone', 'address', 'profilePictureUrl']
 */
export async function updateEmployeeSelfProfile(uid, { phone, address, profilePictureUrl }) {
  if (!uid) throw new Error('User UID is required for profile update');
  
  const updateData = {};
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;
  if (profilePictureUrl !== undefined) updateData.profilePictureUrl = profilePictureUrl;

  await updateDoc(userDocRef(uid), updateData);
  return { success: true, updateData };
}

/**
 * Admin update user profile:
 * Admin can update any field on any user document
 */
export async function updateAdminUserProfile(uid, fullData) {
  if (!uid) throw new Error('Target user UID is required');
  
  const cleanData = { ...fullData };
  delete cleanData.id; // Don't write doc id into document data
  delete cleanData.uid;

  await updateDoc(userDocRef(uid), cleanData);
  return { success: true, cleanData };
}
