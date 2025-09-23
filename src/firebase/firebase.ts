// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDZdVy9RJDYSNQJVDUYia94lNE6FpxmhbU",
  authDomain: "mysafeneighbourhood.firebaseapp.com",
  projectId: "mysafeneighbourhood",
  storageBucket: "mysafeneighbourhood.firebasestorage.app",
  messagingSenderId: "104149866468",
  appId: "1:104149866468:web:f784e606d64df963efd9f1",
  measurementId: "G-6FDX3STHNY"
};

export const app = initializeApp(firebaseConfig);