// Main.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import Mapa from './Mapa';
import MapaRutas from './MapaRutas';
import Login from './Login';

export default function Main() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false);

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
      <StatusBar barStyle="light-content" backgroundColor="#005BB5" />

      {/* Header */}
      <View style={styles.header}>
        {/* Botón de menú */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.headerTitle}>
          {currentScreen || 'Inicio'}
        </Text>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setMostrarLogin(true)}
        >
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
            >
              {/* Header del menú */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menú</Text>
                <TouchableOpacity
                  style={styles.closeIconButton}
                  onPress={() => setMenuVisible(false)}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Opciones del menú */}
              <View style={styles.menuItemsContainer}>
                <TouchableOpacity
                  style={styles.menuItemButton}
                  onPress={() => changeScreen('Ver mapa')}
                >
                  <Text style={styles.menuItemIcon}>🗺️</Text>
                  <Text style={styles.menuItemText}>Ver mapa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItemButton}
                  onPress={() => changeScreen('')}
                >
                  <Text style={styles.menuItemIcon}>🏠</Text>
                  <Text style={styles.menuItemText}>Inicio</Text>
                </TouchableOpacity>
              </View>

              {/* Botón de cerrar */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Login */}
      <Modal
        visible={mostrarLogin}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarLogin(false)}
      >
        <Login onClose={() => setMostrarLogin(false)} />
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    marginTop: 80,
    marginHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIconButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  menuItemsContainer: {
    marginBottom: 20,
  },

  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',       // blanco limpio
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E8EF',           // borde sutil elegante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },

  menuItemIcon: {
    fontSize: 26,
    marginRight: 18,
    color: '#007AFF',                 // iconos en azul primario
  },

  menuItemText: {
    fontSize: 18,
    color: '#003D80',                 // azul oscuro elegante
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  closeButton: {
    backgroundColor: '#D4AF37',       // dorado elegante
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

});