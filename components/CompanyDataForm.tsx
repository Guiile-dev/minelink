import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { saveCompanyDataToFirestore } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 👇 Si usas React Navigation con Stack Navigator
type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};

const CompanyDataForm: React.FC<Props> = ({ navigation }) => {
  const [nombreEmpresa, setNombreEmpresa] = useState<string>('');
  const [tipoEmpresa, setTipoEmpresa] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');

  const handleGuardar = async () => {
    if (!nombreEmpresa || !tipoEmpresa || !direccion) {
      Alert.alert('Faltan datos', 'Por favor completa todos los campos');
      return;
    }

    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    try {
      await saveCompanyDataToFirestore(user.uid, {
        nombre: nombreEmpresa,
        tipo: tipoEmpresa,
        direccion,
        creado: new Date(),
      });
      Alert.alert('Éxito', 'Datos guardados correctamente');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      Alert.alert('Error', 'No se pudo guardar la información');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Datos de la Empresa</Text>

        <Text style={styles.label}>Nombre de la Empresa</Text>
        <TextInput
          style={styles.input}
          value={nombreEmpresa}
          onChangeText={setNombreEmpresa}
          placeholder="Ej: Minera XYZ"
        />

        <Text style={styles.label}>Tipo de Empresa</Text>
        <TextInput
          style={styles.input}
          value={tipoEmpresa}
          onChangeText={setTipoEmpresa}
          placeholder="Proveedor / Distribuidor"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
          placeholder="Dirección comercial"
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Guardar información" onPress={handleGuardar} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
  },
});

export default CompanyDataForm;
