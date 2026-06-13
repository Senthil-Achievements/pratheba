import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: "pratheba-ecb34",
  appId: "1:170172874430:web:f6ed866e6a92cf64a128ef",
  storageBucket: "pratheba-ecb34.firebasestorage.app",
  apiKey: "AIzaSyCgl2XdvMpWdaUlJAHG1j2XcTnbvd8l7Bg",
  authDomain: "pratheba-ecb34.firebaseapp.com",
  messagingSenderId: "170172874430",
  measurementId: "G-V767W135RQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
