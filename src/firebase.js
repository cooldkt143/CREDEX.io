import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Firebase config (replace with your own)
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

// Provider scopes
googleProvider.addScope("email");
googleProvider.addScope("profile");

githubProvider.addScope("user:email");

linkedinProvider.addScope("r_liteprofile");
linkedinProvider.addScope("r_emailaddress");

// Firestore
export const db = getFirestore(app);

export default app;