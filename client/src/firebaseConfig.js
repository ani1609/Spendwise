import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDFF6j0TLPNg6Xt4xt9gb0O78yYy0S_Gw",
    authDomain: "spendwise-5b126.firebaseapp.com",
    projectId: "spendwise-5b126",
    storageBucket: "spendwise-5b126.appspot.com",
    messagingSenderId: "420096794526",
    appId: "1:420096794526:web:15676956e8030bedbd808f",
    measurementId: "G-FV9WBK5NVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const transactionsCollection = collection(db, 'transactions');

export { db, transactionsCollection };
