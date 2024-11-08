// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6HZ1Pdac5zO7sLSuY8cqDaoRPWKSOFbo",
  authDomain: "rvcewebsite.firebaseapp.com",
  projectId: "rvcewebsite",
  storageBucket: "rvcewebsite.appspot.com",
  messagingSenderId: "477687439436",
  appId: "1:477687439436:web:a5fad9e19c3bf1b3cd94e9",
  measurementId: "G-QVJ3FNDGL4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);