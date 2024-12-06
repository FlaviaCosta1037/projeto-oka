import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,Timestamp  } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwwciTCJo_gGzukLX6Qhdv7UBUAiAsm4U",
    authDomain: "oka-beach-8ca97.firebaseapp.com",
    databaseURL: "https://oka-beach-8ca97-default-rtdb.firebaseio.com",
    projectId: "oka-beach-8ca97",
    storageBucket: "oka-beach-8ca97.firebasestorage.app",
    messagingSenderId: "442627764884",
    appId: "1:442627764884:web:e0666032cdb7ad6bedba81",
    measurementId: "G-M9LN7DX43Q"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db,Timestamp };
