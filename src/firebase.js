import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD63dHbbESh21Vmak9pBhKQVu9BNZZwF-g",
  authDomain: "credex-17f33.firebaseapp.com",
  projectId: "credex-17f33",
  storageBucket: "credex-17f33.firebasestorage.app",
  messagingSenderId: "781761985890",
  appId: "1:781761985890:web:b2cc4117228e3d4ad3c03b",
  measurementId: "G-0764DR2HXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const linkedinProvider = new OAuthProvider("linkedin.com");

// Firestore
export const db = getFirestore(app);

// Add or update user in Firestore
export const addOrUpdateUser = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userData = {
    username: user.displayName || "",
    handle: `@${user.displayName?.replace(/\s+/g, "_").toLowerCase() || "user"}`,
    rank: 0,
    phone: "",
    location: "",
    skills: [],
    platforms: {
      github: 0,
      hackerrank: 0,
      leetcode: 0,
      linkedin: 0
    },
    education: [],
    profileCompletion: 0,
    email: user.email || ""
  };

  try {
    await setDoc(userRef, userData, { merge: true });
    return userRef;
  } catch (error) {
    console.error("Error creating user document:", error.message);
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error.message);
  }
};

export default app;