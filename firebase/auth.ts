// firebase/auth.ts

import {
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from './config';

// 👤 Interfaz para los datos de registro
interface SignUpData {
  email: string;
  password: string;
  nombre: string;
  tipoEmpresa: 'proveedor' | 'comprador';
}

// ✅ Registrar usuario y guardar en Firestore
export const signUpUser = async ({
  email,
  password,
  nombre,
  tipoEmpresa,
}: SignUpData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = userCredential.user;

    await setDoc(doc(FIREBASE_DB, 'usuarios', user.uid), {
      uid: user.uid,
      nombre,
      email,
      tipoEmpresa,
      creado: new Date(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// ✅ Logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(FIREBASE_AUTH);
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
};
