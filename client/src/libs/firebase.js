// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-cf545.firebaseapp.com",
  projectId: "reactchatapp-cf545",
  storageBucket: "reactchatapp-cf545.appspot.com",
  messagingSenderId: "412959507258",
  appId: "1:412959507258:web:aab6d17bc86f5636d08603",
  measurementId: "G-7CX86RVGTE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize could Firestore, Firebase DB,  and Firebase Auth
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
