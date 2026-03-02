import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyABshlWeDM-ThJf_NsIsNoKioVAwNj_sgk',
  authDomain: 'biohacker-57c5d.firebaseapp.com',
  projectId: 'biohacker-57c5d',
  storageBucket: 'biohacker-57c5d.firebasestorage.app',
  messagingSenderId: '1781189164467',
  appId: '1:1781189164467:web:8888bd77c6c8cb667dad96',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
