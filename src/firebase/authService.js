import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { setDoc, getDoc } from 'firebase/firestore';
import { auth } from './config';
import { userDocRef } from './schema';

/**
 * Validate password requirements:
 * - Minimum 8 characters
 * - At least 1 number
 * - At least 1 symbol
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least 1 number' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least 1 special symbol (e.g. !@#$%^&*)' };
  }
  return { isValid: true };
}

/**
 * Sign up a new user:
 * 1. Validate password client-side
 * 2. Create user with Firebase Auth
 * 3. Create document in Firestore users/{uid} collection
 * Note: No email verification required — user can sign in immediately after registration.
 */
export async function signUpUser({
  employeeId,
  fullName,
  email,
  password,
  role = 'employee',
  phone = '',
  address = '',
  profilePictureUrl = '',
  jobTitle = '',
  department = '',
  dateJoined = '',
}) {
  // 1. Client-side password validation
  const validation = validatePassword(password);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 2. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Set display name in Auth profile
  if (fullName) {
    await updateProfile(user, { displayName: fullName }).catch(() => {});
  }

  // 3. Create document in users/{uid}
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || employeeId || email)}`;
  const userDocData = {
    employeeId: employeeId?.trim() || `EMP-${Date.now().toString().slice(-4)}`,
    fullName: fullName?.trim() || email.split('@')[0],
    email: email.trim().toLowerCase(),
    role: role === 'admin' ? 'admin' : 'employee',
    phone: phone || '',
    address: address || '',
    profilePictureUrl: profilePictureUrl || defaultAvatar,
    jobTitle: jobTitle || (role === 'admin' ? 'HR Administrator' : 'Software Engineer'),
    department: department || (role === 'admin' ? 'Human Resources' : 'Engineering'),
    dateJoined: dateJoined || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  await setDoc(userDocRef(user.uid), userDocData);

  return {
    success: true,
    user,
    profile: userDocData,
    message: 'Account created successfully! You can now sign in.',
  };
}

/**
 * Sign in existing user:
 * 1. Authenticate with email & password
 * 2. Fetch user profile from Firestore users/{uid}
 * 3. Return user, profile, and role for routing
 */
export async function signInUser({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Fetch Firestore user doc
  const docSnap = await getDoc(userDocRef(user.uid));
  let profile = null;

  if (docSnap.exists()) {
    profile = docSnap.data();
  } else {
    // Fallback profile if doc was not found
    profile = {
      employeeId: 'EMP-TEMP',
      fullName: user.displayName || email.split('@')[0],
      email: user.email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'employee',
      profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      jobTitle: 'Team Member',
      department: 'General',
      dateJoined: new Date().toISOString().split('T')[0],
    };
    await setDoc(userDocRef(user.uid), profile).catch(() => {});
  }

  return {
    user,
    profile,
    role: profile.role || 'employee',
  };
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  await signOut(auth);
}
