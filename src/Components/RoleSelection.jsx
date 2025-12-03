// RoleSelection.jsx
import React, { useState } from 'react';
import AutoridadForm from "./AutoridadForm";
import TransportistaForm from "./TransportistaForm";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';

export default function RoleSelection({ visible, userData, onComplete, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Mostrar formulario según rol
  const [showAutoridadForm, setShowAutoridadForm] = useState(false);
  const [showTransportistaForm, setShowTransportistaForm] = useState(false);

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (role === "autoridad") {
        setShowAutoridadForm(true);
      } else if (role === "transportista") {
        setShowTransportistaForm(true);
      }
    }, 800);
  };

  return (
    <>

      {/* MODAL PRINCIPAL PARA ELEGIR ROL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>👤 Selecciona tu Rol</Text>
            <Text style={styles.subtitle}>
              Hola {userData?.displayName || 'Usuario'}
            </Text>
            <Text style={styles.description}>
              Selecciona cómo deseas registrarte:
            </Text>

            {/* Botón Autoridad */}
            <TouchableOpacity
              style={[
                styles.roleButton,
                styles.autoridadButton,
                selectedRole === 'autoridad' && styles.roleButtonSelected,
                loading && styles.buttonDisabled
              ]}
              onPress={() => handleRoleSelection('autoridad')}
              disabled={loading}
            >
              {loading && selectedRole === 'autoridad' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.roleIcon}>🏛️</Text>
                  <Text style={styles.roleTitle}>Autoridad</Text>
                  <Text style={styles.roleDescription}>
                    Gestión de rutas, reportes y supervisión
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Botón Transportista */}
            <TouchableOpacity
              style={[
                styles.roleButton,
                styles.transportistaButton,
                selectedRole === 'transportista' && styles.roleButtonSelected,
                loading && styles.buttonDisabled
              ]}
              onPress={() => handleRoleSelection('transportista')}
              disabled={loading}
            >
              {loading && selectedRole === 'transportista' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.roleIcon}>🚛</Text>
                  <Text style={styles.roleTitle}>Transportista</Text>
                  <Text style={styles.roleDescription}>
                    Gestiona rutas, vehículos y alertas
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {!loading && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* FORMULARIO AUTORIDAD */}
      <AutoridadForm
        visible={showAutoridadForm}
        userData={userData}
        onCancel={() => setShowAutoridadForm(false)}
        onComplete={(data) => {
          setShowAutoridadForm(false);
          onComplete(data);
        }}
      />

      {/* FORMULARIO TRANSPORTISTA */}
      <TransportistaForm
        visible={showTransportistaForm}
        userData={userData}
        onCancel={() => setShowTransportistaForm(false)}
        onComplete={(data) => {
          setShowTransportistaForm(false);
          onComplete(data);
        }}
      />

    </>
  );
}

// =======================
// ESTILOS
// =======================
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 25,
  },
  roleButton: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
  },
  autoridadButton: {
    backgroundColor: '#007AFF',
    borderColor: 'transparent',
  },
  transportistaButton: {
    backgroundColor: '#38BFA7',
    borderColor: 'transparent',
  },
  roleButtonSelected: {
    borderColor: '#FFD700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  roleIcon: {
    fontSize: 50,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  roleDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});
