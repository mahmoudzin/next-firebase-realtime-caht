// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHDSXF_BN-Bj_IN71NaU1DyENFfKDeINI",
  authDomain: "chat-app-c4869.firebaseapp.com",
  projectId: "chat-app-c4869",
  storageBucket: "chat-app-c4869.appspot.com",
  messagingSenderId: "615091745252",
  appId: "1:615091745252:web:af170200aa54010ae557f1",
  measurementId: "G-9JC49WLHZZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
