// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "surajestate-2571e.firebaseapp.com",
  projectId: "surajestate-2571e",
  storageBucket: "surajestate-2571e.appspot.com",
  messagingSenderId: "364473737768",
  appId: "1:364473737768:web:36d8d44350a26373644b1d",
  measurementId: "G-DEFT1C5FHZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
