// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWtpK-3GOLwhN3dMq99EsUSWQs_l4lcEE",
  authDomain: "jamboree-521ad.firebaseapp.com",
  projectId: "jamboree-521ad",
  storageBucket: "jamboree-521ad.appspot.com",
  messagingSenderId: "77504640580",
  appId: "1:77504640580:web:f769fe56aa8449af69ae11",
  measurementId: "G-4ECW1C483G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
