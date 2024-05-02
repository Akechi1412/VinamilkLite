import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDWoGdzsnsTG6y4kLnOshfa9xTy7bR8s94',
  authDomain: 'vinamilk-lite-cf427.firebaseapp.com',
  projectId: 'vinamilk-lite-cf427',
  storageBucket: 'vinamilk-lite-cf427.appspot.com',
  messagingSenderId: '512058637865',
  appId: '1:512058637865:web:137452cbdfc75e6c662638',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
