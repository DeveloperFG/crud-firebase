import firebase from  'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


let firebaseConfig = {
    apiKey: "AIzaSyCDIOAyPGoy1Pdw90R9Bm56io2d-SWe4-U",
    authDomain: "teste-d30c5.firebaseapp.com",
    projectId: "teste-d30c5",
    storageBucket: "teste-d30c5.appspot.com",
    messagingSenderId: "279511462654",
    appId: "1:279511462654:web:54167f5cad3eede3d52baf",
    measurementId: "G-LX33WTQNR7"
  };
  
  // Initialize Firebase
  
  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;