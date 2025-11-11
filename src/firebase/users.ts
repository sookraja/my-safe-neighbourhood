import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash?: string;
}

// Adds to user  collection
export const addUser = async (userId: string, userData: Partial<UserData>) => {
  try {
    await setDoc(doc(db, "Users", userId), {
      id: userId,
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'user',
      ...userData
    }, { merge: true });
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

// Gets all the user data
export const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user: ", error);
    throw error;
  }
};

// Updates user data
export const updateUser = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
};
