import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function handleCreatAccount(loginInfo) {
  createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
    .then((userCredential) => {
      // Signed up
      console.log("Login successfully");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

export function authendicateUser(loginInfo, setLogIn) {
  signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
    .then((userCredential) => {
      setLogIn(true);
      console.log("done done");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
