
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
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

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(firestore)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn(
          'Multiple tabs open, persistence can only be enabled in one tab at a time.'
        );
      } else if (err.code === 'unimplemented') {
        console.warn(
          'The current browser does not support all of the features required to enable persistence.'
        );
      }
    });
}

export { auth, firestore, storage };
export default app;
