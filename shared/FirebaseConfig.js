// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuLXpubNn51RYvp0DmM4wAoLPS4pF1rW0",
  authDomain: "sportapp-4d235.firebaseapp.com",
  projectId: "sportapp-4d235",
  storageBucket: "sportapp-4d235.appspot.com",
  messagingSenderId: "783621043871",
  appId: "1:783621043871:web:fd3baeb2c5d5674baad4aa",
  measurementId: "G-V56V6ZLDQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}

export default app;
