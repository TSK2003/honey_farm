import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuQ98AEcvhmrT_hmTna8xlH-e8g92KVDE",
  authDomain: "honey-farm-f6852.firebaseapp.com",
  projectId: "honey-farm-f6852",
  storageBucket: "honey-farm-f6852.firebasestorage.app",
  messagingSenderId: "156339160262",
  appId: "1:156339160262:web:43e9de61694e6ffebdc3c7",
  measurementId: "G-N6PBKRFGWK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
