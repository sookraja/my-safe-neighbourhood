import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, validatePassword } from "firebase/auth";
import app from "./firebase";


const auth = getAuth(app);

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

const status = await validatePassword(getAuth(), "some-pass");
if (!status.isValid) {
  // Password could not be validated. Use the status to show what
  // requirements are met and which are missing.

  // If a criterion is undefined, it is not required by policy. If the
  // criterion is defined but false, it is required but not fulfilled by
  // the given password. For example:
  const needsLowerCase = status.containsLowercaseLetter !== true;
}