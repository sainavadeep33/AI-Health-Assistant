import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // If demo mode guest, inject seed data if not present (simplified for demo)
      if (user && user.isAnonymous) {
          localStorage.setItem('demo_mode', 'true');
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginAsGuest = () => signInAnonymously(auth);
  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsGuest,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
