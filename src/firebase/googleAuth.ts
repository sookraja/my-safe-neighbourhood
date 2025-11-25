import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userDocRef = doc(db, 'Users', user.uid);
  //im basically checking if the user already exists 
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: user.email,                      
      id: user.uid,                          
      name: user.displayName,                
      role: 'user', 
    });
  }

  return user;
};