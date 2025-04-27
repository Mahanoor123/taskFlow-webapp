import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendSignInLinkToEmail
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  limit,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBx8xXwu55gt3Luyi03rKYRtoWnLYc9iBE",
  authDomain: "taskflow-webapp.firebaseapp.com",
  projectId: "taskflow-webapp",
  storageBucket: "taskflow-webapp.firebasestorage.app",
  messagingSenderId: "725199127245",
  appId: "1:725199127245:web:81d87a892dd932bb04df84"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updateEmail,
  sendSignInLinkToEmail,
  limit,
  Timestamp,
};
