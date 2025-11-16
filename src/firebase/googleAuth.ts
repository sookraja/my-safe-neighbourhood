import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      role: 'user',
      emailNotifications: false,
      latitude: null,
      longitude: null,
      createdAt: new Date().toISOString(),
    });
  }

  return user;
};