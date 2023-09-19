

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase";
import "firebase/firestore";
require('firebase/auth');



const firebaseConfig = {
    apiKey: "AIzaSyD7Ayo36UyEFLGq939UA1YPuqM89VPdZdI",
    authDomain: "learn-380a2.firebaseapp.com",
    projectId: "learn-380a2",
    storageBucket: "learn-380a2.appspot.com",
    messagingSenderId: "497072739065",
    appId: "1:497072739065:web:a088778dc51e3e6dc9c828",
    measurementId: "G-LWZNQYYBQ2"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db, firebase };

