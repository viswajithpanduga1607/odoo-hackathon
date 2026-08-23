import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import { userDocRef } from '../firebase/schema';
import { logoutUser } from '../firebase/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docSnap = await getDoc(userDocRef(firebaseUser.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Always merge Firebase Auth displayName as fallback so fullName is never empty
            const mergedProfile = {
              ...data,
              fullName: data.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: data.email || firebaseUser.email,
              profilePictureUrl: data.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName || data.email || firebaseUser.uid)}`,
            };
            setProfile(mergedProfile);
            const userRole = data.role || 'employee';
            setRole(userRole);
          } else {
            // No Firestore doc yet — build a minimal profile from Firebase Auth data
            const fallbackProfile = {
              fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email,
              role: 'employee',
              profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.uid)}`,
            };
            setProfile(fallbackProfile);
            setRole('employee');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Even on error, show the Auth user's name
          setProfile({
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            role: 'employee',
            profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.uid)}`,
          });
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
