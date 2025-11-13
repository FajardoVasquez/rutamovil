import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Mapa() {
  return (
    <View style={styles.container}>
      {/* Logo principal */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
        style={styles.logo}
      />

      {/* Texto de bienvenida */}
      <Text style={styles.title}>🌿 Bienvenido a la App Móvil</Text>
      <Text style={styles.subtitle}>
        Explora rutas, visualiza mapas interactivos y gestiona tus recorridos de manera sencilla desde cualquier lugar.
      </Text>

      {/* Sección de cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Rutas seguras</Text>
          <Text style={styles.cardText}>Descubre las mejores rutas ecológicas cerca de ti.</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4472/4472510.png' }}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Explora el mapa</Text>
          <Text style={styles.cardText}>Accede a mapas interactivos en tiempo real.</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/992/992651.png' }}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Perfil ecológico</Text>
          <Text style={styles.cardText}>Guarda tus recorridos y mide tu impacto ambiental.</Text>
        </View>
      </View>

      {/* Botón secundario */}
      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryText}>Más información</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f7ff',
    padding: 20,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.42,
    margin: 8,
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardIcon: {
    width: width * 0.12,
    height: width * 0.12,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#007AFF',
    fontSize: width * 0.04,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardText: {
    textAlign: 'center',
    color: '#555',
    fontSize: width * 0.032,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginVertical: 5,
    width: width * 0.6,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#e6e6e6',
  },
  secondaryText: {
    color: '#007AFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
