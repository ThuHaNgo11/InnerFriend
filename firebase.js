import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import {REACT_APP_FIREBASE_API_KEY} from 'react-native-dotenv';

const firebaseConfig = {
  // apiKey: "AIzaSyCCIIJWJUNTmtYmq8Q03NOVpcQAtsSUS3E",
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: "innerfriendv2.firebaseapp.com",
  projectId: "innerfriendv2",
  storageBucket: "innerfriendv2.appspot.com",
  messagingSenderId: "955777989959",
  appId: "1:955777989959:web:a7c8beb359d8089deea062",
  measurementId: "G-NTT0WK2JKC"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase}