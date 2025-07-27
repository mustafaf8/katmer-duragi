// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfE6WPQtodYxoTTKHHZGJYTnEZKV2dCj0",
  authDomain: "katmer-duragi.firebaseapp.com",
  projectId: "katmer-duragi",
  storageBucket: "katmer-duragi.appspot.com",
  messagingSenderId: "428664638373",
  appId: "1:428664638373:web:131a8a8b316e565f2cf64c",
  measurementId: "G-G9W7BVZFZQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
