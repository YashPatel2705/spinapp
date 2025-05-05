// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO7cOWrzqn6AahfmkV08cs5arlZr4m89Y",
  authDomain: "auctionspin-d40ff.firebaseapp.com",
  projectId: "auctionspin-d40ff",
  storageBucket: "auctionspin-d40ff.appspot.com", 
  messagingSenderId: "396341428933",
  appId: "1:396341428933:web:3411efdc0365cd42d2e6ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
