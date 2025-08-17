import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import type { QuizResult } from '../types';

// IMPORTANT: Replace with your own Firebase project's configuration.
// You can find these credentials in your Firebase project settings page.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyASj2r7aI2dEAkV2w_TjM3U0zfMKjC3-S0",
  authDomain: "wap-gr4-wetenskap-2025.firebaseapp.com",
  projectId: "wap-gr4-wetenskap-2025",
  storageBucket: "wap-gr4-wetenskap-2025.firebasestorage.app",
  messagingSenderId: "693962862072",
  appId: "1:693962862072:web:94bd9adc160b1273113a0d",
  measurementId: "G-P9SW887WWH"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  return auth.signInWithPopup(provider);
};

export const logout = () => {
  return auth.signOut();
};

const resultsCollection = db.collection('quizResults');

export const storeQuizResult = async (result: QuizResult) => {
  try {
    await resultsCollection.add(result);
  } catch (error) {
    console.error("Error storing quiz result: ", error);
  }
};

export const getUserQuizHistory = async (userId: string): Promise<QuizResult[]> => {
    try {
        const q = resultsCollection.where("userId", "==", userId).orderBy("date", "desc");
        const querySnapshot = await q.get();
        const history: QuizResult[] = [];
        querySnapshot.forEach((doc) => {
            history.push(doc.data() as QuizResult);
        });
        return history;
    } catch (error) {
        console.error("Error fetching user history: ", error);
        return [];
    }
};