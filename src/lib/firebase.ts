
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzXSsvvs6xNw3KQh3egSFX0gB2wonVolM",
  authDomain: "dharma-51b9d.firebaseapp.com",
  projectId: "dharma-51b9d",
  storageBucket: "dharma-51b9d.firebasestorage.app",
  messagingSenderId: "515969336329",
  appId: "1:515969336329:web:2b4c553bc93f2727d164d8",
  measurementId: "G-QX45BSFVQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
export default app;
