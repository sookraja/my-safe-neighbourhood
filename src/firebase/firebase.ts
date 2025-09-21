// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...other config values from your Firebase project settings
};

export const app = initializeApp(firebaseConfig);