// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfbX3BFfoxTAVbY7QMlTxozIE0z7Vtj5g",
  authDomain: "academicportal-34c78.firebaseapp.com",
  projectId: "academicportal-34c78",
  storageBucket: "academicportal-34c78.firebasestorage.app",
  messagingSenderId: "505146706739",
  appId: "1:505146706739:web:5beabc3ccba6bd73b3cc46",
  measurementId: "G-NHG5SSJWGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);