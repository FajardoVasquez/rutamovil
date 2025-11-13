// Main.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import Mapa from './Mapa';
import MapaRutas from './MapaRutas';

export default function Main() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('');

  const changeScreen = (screen) => {
    setCurrentScreen(screen);
    setMenuVisible(false);
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'Ver mapa':
        return <MapaRutas />;
      default:
        return <Mapa />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de menú */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.menuText}>☰ Menú</Text>
      </TouchableOpacity>

      {/* Contenido dinámico */}
      <Text style={styles.title}>{currentScreen}</Text>
      {renderContent()}

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.menuTitle}>Menú</Text>

            <TouchableOpacity onPress={() => changeScreen('Ver mapa')}>
              <Text style={styles.menuItem}>Ver mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginTop: 80,
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
    color: '#007AFF',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeText: {
    fontSize: 16,
    color: 'red',
  },
});