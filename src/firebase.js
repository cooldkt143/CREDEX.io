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
  const emailPrefix = user.email ? user.email.split("@")[0] : "user";
  const handle = `@${emailPrefix.toLowerCase()}`;
  const userData = {
    username: user.displayName || "",
    handle: handle,
    rank: 0,
    phone: "",
    location: "",
    skills: [],
    platforms: {
      github: 0,
      hackerrank: 0,
      geeksforgeeks: 0,
      linkedin: 0
    },
    education: [],
    profileCompletion: 0,
    email: user.email || ""
  };

  try {
    await setDoc(userRef, userData, { merge: true });

    // Send user login data to MongoDB via FastAPI backend
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          userData: userData
        })
      });
    } catch (apiErr) {
      console.warn("FastAPI backend login storage failed or backend offline:", apiErr.message);
    }

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