// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b04a6.firebaseapp.com",
  projectId: "mern-blog-b04a6",
  storageBucket: "mern-blog-b04a6.appspot.com",
  messagingSenderId: "976993477969",
  appId: "1:976993477969:web:286c2c70648f157d44df70"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);