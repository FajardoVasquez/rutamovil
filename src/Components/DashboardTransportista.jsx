// DashboardTransportista.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';

export default function DashboardTransportista({ userData, datosTransportista, onClose }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [perfilVisible, setPerfilVisible] = useState(false);
  const auth = getAuth();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const togglePerfil = () => {
    setPerfilVisible(!perfilVisible);
  };

  const handleMenuOption = (option) => {
    setMenuVisible(false);
    // Aquí puedes navegar a las diferentes pantallas
    console.log('Opción seleccionada:', option);
  };

  const handleLogout = async () => {
    Alert.alert(
      '🔐 Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              if (onClose) onClose();
              Alert.alert('✅', 'Sesión cerrada exitosamente');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('❌ Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra superior con menú hamburguesa y perfil */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Panel Transportista</Text>

        <TouchableOpacity onPress={togglePerfil} style={styles.profileButton}>
          {userData?.photoURL ? (
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.profileAvatar}
            />
          ) : (
            <View style={styles.profileAvatarPlaceholder}>
              <Text style={styles.profileInitial}>
                {userData?.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Menú lateral tipo hamburguesa */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú</Text>
              <TouchableOpacity onPress={toggleMenu}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleMenuOption('mapa')}
            >
              <Text style={styles.menuOptionIcon}>🗺️</Text>
              <Text style={styles.menuOptionText}>Ver Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleMenuOption('reportar')}
            >
              <Text style={styles.menuOptionIcon}>⚠️</Text>
              <Text style={styles.menuOptionText}>Reportar Accidentes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleMenuOption('notificaciones')}
            >
              <Text style={styles.menuOptionIcon}>🔔</Text>
              <Text style={styles.menuOptionText}>Notificaciones</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => handleMenuOption('configuracion')}
            >
              <Text style={styles.menuOptionIcon}>⚙️</Text>
              <Text style={styles.menuOptionText}>Configuración</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Perfil */}
      <Modal
        visible={perfilVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={togglePerfil}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={togglePerfil}
        >
          <View style={styles.perfilContainer}>
            <View style={styles.perfilHeader}>
              {userData?.photoURL ? (
                <Image
                  source={{ uri: userData.photoURL }}
                  style={styles.perfilAvatar}
                />
              ) : (
                <View style={styles.perfilAvatarPlaceholder}>
                  <Text style={styles.perfilInitial}>
                    {userData?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
              <Text style={styles.perfilName}>{userData?.displayName || 'Usuario'}</Text>
              <Text style={styles.perfilRole}>🚛 TRANSPORTISTA</Text>
            </View>

            <View style={styles.perfilInfo}>
              <View style={styles.perfilInfoRow}>
                <Text style={styles.perfilLabel}>Email:</Text>
                <Text style={styles.perfilValue}>{userData?.email || 'N/A'}</Text>
              </View>
              {datosTransportista?.usuario?.telefono && (
                <View style={styles.perfilInfoRow}>
                  <Text style={styles.perfilLabel}>Teléfono:</Text>
                  <Text style={styles.perfilValue}>{datosTransportista.usuario.telefono}</Text>
                </View>
              )}
              {datosTransportista?.usuario?.cedula && (
                <View style={styles.perfilInfoRow}>
                  <Text style={styles.perfilLabel}>Cédula:</Text>
                  <Text style={styles.perfilValue}>{datosTransportista.usuario.cedula}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {/* Header de bienvenida */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Bienvenido, {userData?.displayName?.split(' ')[0] || 'Usuario'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            🚛 Transportista Activo
          </Text>
        </View>

        {/* Estado de ruta actual */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚛 Ruta Actual</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routeStatus}>
              <Text style={styles.routeStatusText}>✅ En Tránsito</Text>
            </View>
            <View style={styles.routeDetail}>
              <Text style={styles.routeInfo}>📍 Origen: Guayaquil</Text>
              <Text style={styles.routeInfo}>🎯 Destino: Quito</Text>
              <Text style={styles.routeInfo}>⏱️ ETA: 4 horas</Text>
              <Text style={styles.routeInfo}>🛣️ Distancia: 420 km</Text>
            </View>

            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Ver Detalles de Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>





        {/* Configuración de notificaciones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔔 Configuración de Notificaciones</Text>
          <View style={styles.notificationInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Preferencia:</Text>
              <Text style={styles.value}>
                {datosTransportista?.preferenciaNotificacion || 'No configurada'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Frecuencia:</Text>
              <Text style={styles.value}>
                {datosTransportista?.frecuenciaAlertas || 'No configurada'}
              </Text>
            </View>
            <TouchableOpacity style={styles.configButton}>
              <Text style={styles.configButtonText}>Ajustar Notificaciones</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Actividad Reciente</Text>



          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nueva ruta asignada</Text>
              <Text style={styles.activityTime}>Hace 5 horas</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Documento actualizado</Text>
              <Text style={styles.activityTime}>Hace 1 día</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#34C759',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  menuButton: {
    padding: 10
  },
  hamburgerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 3,
    borderRadius: 2
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  },
  profileButton: {
    padding: 5
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },
  profileAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34C759'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start'
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: '75%',
    height: '100%',
    paddingTop: 50
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333'
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300'
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuOptionIcon: {
    fontSize: 24,
    marginRight: 15
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10
  },
  perfilContainer: {
    backgroundColor: '#fff',
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  perfilHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  perfilAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  perfilAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  perfilInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff'
  },
  perfilName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },
  perfilRole: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15
  },
  perfilInfo: {
    paddingVertical: 20
  },
  perfilInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  perfilLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  perfilValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  perfilButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  perfilButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  content: {
    flex: 1
  },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666'
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333'
  },
  routeContainer: {
    paddingVertical: 10
  },
  routeStatus: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center'
  },
  routeStatusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34C759'
  },
  routeDetail: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  routeInfo: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500'
  },
  trackButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    gap: 10
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#34C759',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  quickActionIcon: {
    fontSize: 32,
    marginRight: 15
  },
  quickActionContent: {
    flex: 1
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: '#999'
  },
  notificationInfo: {
    paddingVertical: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600'
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  configButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  configButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginTop: 6,
    marginRight: 12
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 3
  },
  activityTime: {
    fontSize: 12,
    color: '#999'
  }
});