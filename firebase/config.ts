// firebase/config.ts

import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  Auth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚙️ Configuración Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAVtEZNpNO90ijZsmf8HXxZ6HD55hYu22w',
  authDomain: 'urbania-app-12adf.firebaseapp.com',
  projectId: 'urbania-app-12adf',
  storageBucket: 'urbania-app-12adf.appspot.com',
  messagingSenderId: '319768999679',
  appId: '1:319768999679:web:8607c5c28eb0f1f787feca',
};

// ✅ Inicializa Firebase App
const FIREBASE_APP: FirebaseApp = initializeApp(firebaseConfig);

// ✅ Inicializa servicios
const FIREBASE_DB: Firestore = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE: FirebaseStorage = getStorage(FIREBASE_APP);

// ✅ Inicializa autenticación con persistencia adecuada
let FIREBASE_AUTH: Auth;

if (Platform.OS === 'web') {
  FIREBASE_AUTH = getAuth(FIREBASE_APP);
} else {
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// ✅ Exporta para usar en toda la app
export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };
