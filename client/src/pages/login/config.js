// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup,FacebookAuthProvider , GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzHDUJ05MzY4XlI7vE2iWZk9NjkgYgeG8",
  authDomain: "sports-management-system-d189d.firebaseapp.com",
  projectId: "sports-management-system-d189d",
  storageBucket: "sports-management-system-d189d.appspot.com",
  messagingSenderId: "581948476686",
  appId: "1:581948476686:web:b14bac7207df087927db5f",
  measurementId: "G-5SHPJS2EWJ"
};

const fbAuthProvider = new FacebookAuthProvider()

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const FacebookAuth = async ()=>{
    const fbAuth = signInWithPopup(auth,fbAuthProvider)
    return fbAuth
}
export const GoogleAuth = async ()=>{
    const googleAuth = signInWithPopup(auth,provider)
    return googleAuth
}