import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { logoutUser } from '../firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [rol, setRol] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const docRef = doc(FIREBASE_DB, 'empresas', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRol(docSnap.data().rol);
        }
      } catch (error) {
        console.error('Error al obtener el rol:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/login');
  };

  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la web</Text>
      <Text style={styles.subtext}>Rol: {rol}</Text>

      {rol === 'Proveedor' && (
        <>
          <Button
            title="Mis Productos"
            onPress={() => router.push('/misProductos')}
          />
          <Button
            title="Publicar nuevo producto"
            onPress={() => router.push('/publicarProducto')}
          />
        </>
      )}

      {rol === 'Comprador' && (
        <>
          <Button
            title="Explorar proveedores"
            onPress={() => router.push('/explorarProveedores')}
          />
        </>
      )}

      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
});
