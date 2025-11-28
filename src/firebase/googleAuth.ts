import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  //this opens the google sign in pop up
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
   //checking if the user already exists/referencing document in firebase
  const userDocRef = doc(db, 'Users', user.uid); 
  const userDoc = await getDoc(userDocRef);

  //creating the user profile if its the first time signning in 
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