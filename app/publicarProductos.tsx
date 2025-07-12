import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  FIREBASE_AUTH,
  FIREBASE_DB,
  FIREBASE_STORAGE,
} from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function PublicarProductoScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const router = useRouter();

  const handleSeleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handlePublicar = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      if (!nombre || !descripcion || !categoria || !imagenUri) {
        Alert.alert(
          'Error',
          'Completa todos los campos e incluye una imagen.'
        );
        return;
      }

      setSubiendo(true);

      const response = await fetch(imagenUri);
      const blob = await response.blob();

      const nombreUnico = uuidv4();
      const rutaRef = ref(FIREBASE_STORAGE, `productos/${nombreUnico}`);

      await uploadBytes(rutaRef, blob);
      const imagenUrl = await getDownloadURL(rutaRef);

      await addDoc(collection(FIREBASE_DB, 'productos'), {
        uid: user.uid,
        nombre,
        descripcion,
        categoria,
        imagenUrl,
        creado: new Date(),
      });

      Alert.alert(
        'Producto publicado',
        'Tu producto fue registrado exitosamente.'
      );
      router.back();
    } catch (error: any) {
      console.error('Error al publicar:', error);
      Alert.alert('Error al publicar', error.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicar Producto o Servicio</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del producto o servicio"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Categoría (ej. maquinaria, seguridad...)"
        value={categoria}
        onChangeText={setCategoria}
      />

      <Button title="Seleccionar imagen" onPress={handleSeleccionarImagen} />

      {imagenUri && (
        <Image
          source={{ uri: imagenUri }}
          style={{ width: '100%', height: 200, marginVertical: 10 }}
          resizeMode="cover"
        />
      )}

      <Button
        title={subiendo ? 'Publicando...' : 'Publicar'}
        onPress={handlePublicar}
        disabled={subiendo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
});
