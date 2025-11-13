// Login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

export default function Login({ onClose }) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (correo === "1234" && password === "1234") {
      Alert.alert("✔️ Bienvenido", "Inicio de sesión exitoso");
    } else {
      Alert.alert("❌ Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>🔐 Iniciar Sesión</Text>

        {/* Inputs de correo y contraseña */}
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
        />

        {/* Botón Google */}
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Continuar con Google</Text>
        </TouchableOpacity>

        {/* Botón de login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Ingresar</Text>
        </TouchableOpacity>

        {/* Botón para continuar sin login */}
        <TouchableOpacity onPress={onClose} style={styles.skipButton}>
          <Text style={styles.skipText}>Mantener sin iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 15,
  },
  skipButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  skipText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 15,
  },
});
