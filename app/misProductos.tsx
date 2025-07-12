import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebase/config';

export default function MisProductosScreen() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const q = query(
          collection(FIREBASE_DB, 'productos'),
          where('uid', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {item.imagenUri ? (
        <Image source={{ uri: item.imagenUri }} style={styles.imagen} />
      ) : null}
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.categoria}>{item.categoria}</Text>
      <Text>{item.descripcion}</Text>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <FlatList
      data={productos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.lista}
      ListEmptyComponent={
        <Text style={styles.empty}>No has publicado productos aún.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoria: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
