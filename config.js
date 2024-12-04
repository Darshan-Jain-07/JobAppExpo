import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDT_QoGd_ORp0aSmne3BjvZMKTpHU9JOoc",
    authDomain: "jobapp-ac87e.firebaseapp.com",
    projectId: "jobapp-ac87e",
    storageBucket: "jobapp-ac87e.firebasestorage.app",
    messagingSenderId: "1048578635301",
    appId: "1:1048578635301:web:40a4449f0e52df1f7f31cc",
    measurementId: "G-P5EEW6WZSE"
  };

if(!firebase.app.length){
    firebase.initializeApp(firebaseConfig);
}

export { firebase };