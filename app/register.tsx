import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [rol, setRol] = useState('Proveedor');
  const [categoria, setCategoria] = useState('Maquinaria y Equipos');

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      await setDoc(doc(FIREBASE_DB, 'empresas', user.uid), {
        empresa,
        email,
        telefono,
        sitioWeb,
        descripcion,
        ubicacion,
        rol,
        categoria,
        uid: user.uid,
        createdAt: new Date(),
      });

      Alert.alert('Registro exitoso', '¡Bienvenido!');
      router.push('/home');
    } catch (error: any) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Empresa</Text>

      <TextInput style={styles.input} placeholder="Nombre de la empresa" value={empresa} onChangeText={setEmpresa} />
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Sitio web" value={sitioWeb} onChangeText={setSitioWeb} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Ubicación" value={ubicacion} onChangeText={setUbicacion} />

      <Text style={styles.label}>Categoría Principal:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : styles.pickerIOS}
        >
          <Picker.Item label="Maquinaria y Equipos" value="Maquinaria y Equipos" />
          <Picker.Item label="Insumos y Materiales" value="Insumos y Materiales" />
          <Picker.Item label="Servicios Especializados" value="Servicios Especializados" />
          <Picker.Item label="Herramientas y Accesorios" value="Herramientas y Accesorios" />
          <Picker.Item label="Seguridad y Protección" value="Seguridad y Protección" />
          <Picker.Item label="Tecnología y Software" value="Tecnología y Software" />
          <Picker.Item label="Transporte y Logística" value="Transporte y Logística" />
          <Picker.Item label="Energía y Suministros" value="Energía y Suministros" />
          <Picker.Item label="Químicos y Lubricantes" value="Químicos y Lubricantes" />
        </Picker>
      </View>

      <Text style={styles.label}>Rol:</Text>
      <View style={styles.rolContainer}>
        <TouchableOpacity
          style={[styles.rolButton, rol === 'Proveedor' && styles.rolSelected]}
          onPress={() => setRol('Proveedor')}
        >
          <Text style={styles.rolText}>Proveedor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rolButton, rol === 'Comprador' && styles.rolSelected]}
          onPress={() => setRol('Comprador')}
        >
          <Text style={styles.rolText}>Comprador</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A3B5C',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
  },
  pickerIOS: {
    height: 180,
  },
  rolContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  rolButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007B8A',
    borderRadius: 6,
    alignItems: 'center',
  },
  rolSelected: {
    backgroundColor: '#007B8A',
  },
  rolText: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1A3B5C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
