// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp-JTBrgbzoKwzqbu8ot3X02hFjGc-BJA",
  authDomain: "pixiedone-eb7ba.firebaseapp.com",
  databaseURL: "https://pixiedone-eb7ba-default-rtdb.firebaseio.com",
  projectId: "pixiedone-eb7ba",
  storageBucket: "pixiedone-eb7ba.firebasestorage.app",
  messagingSenderId: "608596144779",
  appId: "1:608596144779:web:42e5ad9cfac462a6cd5a8e",
  measurementId: "G-095KXDG28D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);