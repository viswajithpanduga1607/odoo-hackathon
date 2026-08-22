import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import { userDocRef } from '../firebase/schema';
import { logoutUser } from '../firebase/authService';
import { currentUser as mockCurrentUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
        try {
          const docSnap = await getDoc(userDocRef(firebaseUser.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            const userRole = data.role || 'employee';
            setRole(userRole);

            // Sync with mockData currentUser object so existing views stay in sync
            mockCurrentUser.id = data.employeeId || firebaseUser.uid;
            mockCurrentUser.name = data.fullName || firebaseUser.displayName || 'User';
            mockCurrentUser.email = data.email || firebaseUser.email;
            mockCurrentUser.role = userRole;
            mockCurrentUser.avatar = data.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName || data.email)}`;
            mockCurrentUser.department = data.department || (userRole === 'admin' ? 'Human Resources' : 'Engineering');
            mockCurrentUser.designation = data.jobTitle || (userRole === 'admin' ? 'HR Administrator' : 'Software Engineer');
          } else {
            setProfile(null);
            setRole('employee');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole('employee');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setRole('employee');
  };

  const value = {
    user,
    profile,
    role,
    isAdmin: role === 'admin',
    loading,
    logout,
    setUserProfile: (newProfile) => {
      setProfile(newProfile);
      if (newProfile?.role) setRole(newProfile.role);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
