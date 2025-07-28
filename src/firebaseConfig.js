import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfE6WPQtodYxoTTKHHZGJYTnEZKV2dCj0",
  authDomain: "katmer-duragi.firebaseapp.com",
  projectId: "katmer-duragi",
  storageBucket: "katmer-duragi.appspot.com",
  messagingSenderId: "428664638373",
  appId: "1:428664638373:web:131a8a8b316e565f2cf64c",
  measurementId: "G-G9W7BVZFZQ",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const storage = getStorage(app);
export { db };
