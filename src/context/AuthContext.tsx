import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { storage } from '../services/storage';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, name?: string, role?: UserRole) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = storage.updateUserProfile({
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner',
          email: fbUser.email || 'learner@earners.app',
          photoURL: fbUser.photoURL || undefined,
        });
        setUser(profile);
      } else {
        const saved = storage.getUserProfile();
        setUser(saved);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, name?: string, role: UserRole = 'learner') => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 200));

    const updated = storage.updateUserProfile({
      email,
      displayName: name || email.split('@')[0],
      role,
    });
    setUser(updated);
    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google Sign-In fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 200));

    const updated = storage.updateUserProfile({
      email,
      displayName: name,
      role: 'learner',
    });
    setUser(updated);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase Sign-Out error:', err);
    }
    setUser(null);
    setFirebaseUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = storage.updateUserProfile(updates);
    setUser(updated);
  };

  const toggleAdminRole = () => {
    if (!user) return;
    const newRole: UserRole = user.role === 'admin' ? 'learner' : 'admin';
    const updated = storage.updateUserProfile({ role: newRole });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.email === 'npaditya53@gmail.com',
        isLoading,
        login,
        signInWithGoogle,
        signUp,
        logout,
        updateProfile,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
