// app/index.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase/config';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function WelcomeScreen() {
  const scrollRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(FIREBASE_DB, 'productos'));
        const productosConImagen = snapshot.docs
          .map(doc => doc.data())
          .filter(doc => doc.imagenUrl);
        setProductos(productosConImagen);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && productos.length > 0 && contentWidth > 0) {
        const nextX = scrollX + 1;
        scrollRef.current.scrollTo({ x: nextX, animated: false });
        setScrollX(nextX);
        if (nextX >= contentWidth / 2) {
          scrollRef.current.scrollTo({ x: 0, animated: false });
          setScrollX(0);
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [scrollX, productos, contentWidth]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.linkText} onPress={() => router.push('/register')}>
          Registrarse
        </Text>
        <Text style={styles.linkText} onPress={() => router.push('/login')}>
          Iniciar sesión
        </Text>
      </View>

      {/* Logo */}
      <Image
        source={require('../assets/minelinkgo_logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Lema */}
      <Text style={styles.slogan}>Conectamos confianza entre empresas.</Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos o proveedores..."
        placeholderTextColor="#666"
      />

      {/* Cinta de imágenes */}
      {productos.length > 0 && (
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.cinta}
          onContentSizeChange={w => setContentWidth(w)}
        >
          {[...productos, ...productos].map((producto, index) => (
            <Image
              key={index}
              source={{ uri: producto.imagenUrl }}
              style={styles.productoImagen}
            />
          ))}
        </ScrollView>
      )}

      {/* Sección Proveedor */}
      <View style={styles.row}>
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>Proveedor</Text>
          <Text style={styles.description}>
            Publica tus productos y encuentra compradores.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/publicarProducto')}>
            <Text style={styles.primaryButtonText}>Publicar producto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/misProductos')}>
            <Text style={styles.secondaryButtonText}>Mis productos</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/proveedor_image.png')}
          style={styles.sectionImage}
          resizeMode="cover"
        />
      </View>

      {/* Sección Comprador */}
      <View style={styles.row}>
        <Image
          source={require('../assets/comprador_image.png')}
          style={styles.sectionImage}
          resizeMode="cover"
        />
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>Comprador</Text>
          <Text style={styles.description}>
            Busca productos y proveedores de confianza.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/home')}>
            <Text style={styles.primaryButtonText}>Explorar proveedores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/home')}>
            <Text style={styles.secondaryButtonText}>Buscar Productos/Servicios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: screenWidth > 600 ? screenWidth * 0.1 : 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    gap: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#1A3B5C',
    marginLeft: 15,
  },
  logo: {
    width: screenWidth > 768 ? 400 : screenWidth > 500 ? 300 : '100%',
    height: screenWidth > 768 ? 180 : screenWidth > 500 ? 140 : 100,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  slogan: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333333',
    marginBottom: 25,
  },
  cinta: {
    height: 300,
    marginBottom: 30,
  },
  productoImagen: {
    width: screenWidth * 0.3,
    height: 250,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
  row: {
    flexDirection: screenWidth > 768 ? 'row' : 'column',
    justifyContent: 'center',
    marginBottom: 50,
    alignItems: 'center',
    gap: 20,
  },
  textSection: {
    flex: 1,
    maxWidth: 400,
    alignItems: screenWidth > 768 ? 'flex-start' : 'center',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#1A3B5C',
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: screenWidth > 768 ? 'left' : 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
    textAlign: screenWidth > 768 ? 'left' : 'center',
  },
  primaryButton: {
    backgroundColor: '#1A3B5C',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 8,
    width: 240,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#007B8A',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    width: 240,
  },
  secondaryButtonText: {
    color: '#007B8A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionImage: {
    width: screenWidth > 768 ? 300 : 220,
    height: screenWidth > 768 ? 220 : 160,
    borderRadius: 12,
  },
});
