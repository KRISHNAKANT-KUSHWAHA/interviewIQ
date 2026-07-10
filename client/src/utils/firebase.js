// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-2a169.firebaseapp.com",
  projectId: "interviewiq-2a169",
  // storageBucket: "interviewiq-2a169.firebasestorage.app",
  storageBucket: "interviewiq-2a169.appspot.com",
  messagingSenderId: "60259694590",
  appId: "1:60259694590:web:f7ca6bea7c910ff9a732af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//
const auth = getAuth(app); //built in function

const provider = new GoogleAuthProvider();

export { auth, provider }; //export  for pop for mail id
