'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { signUp as firebaseSignUp, signIn as firebaseSignIn, logOut as firebaseLogOut, auth } from '@/firebase/firebaseAuth';
import { addUser } from '@/firebase/users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const userCredential = await firebaseSignUp(email, password);
    
    // Add user to Firestore Users collection
    if (userCredential) {
      await addUser(userCredential.uid, {
        id: userCredential.uid,
        email: email,
        name: name || email.split('@')[0],
        role: 'user'
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    await firebaseSignIn(email, password);
  };

  const logOut = async () => {
    await firebaseLogOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};