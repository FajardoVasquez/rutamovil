// Login.jsx - Con verificación de usuario registrado y Dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut
} from '@react-native-firebase/auth';
import RoleSelection from './RoleSelection';
import DashboardAutoridad from './DashboardAutoridad';
import DashboardTransportista from './DashboardTransportista';

import API from '../services/api';
import styles from '../Styles/Login';

export default function Login({ onClose, onLoginSuccess }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para el modal de selección de rol
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showDashboardAutoridad, setShowDashboardAutoridad] = useState(false);
  const [showDashboardTransportista, setShowDashboardTransportista] = useState(false);

  // Datos del usuario autenticado
  const [googleUserData, setGoogleUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const auth = getAuth();

  // ========================================
  // CONFIGURACIÓN DE GOOGLE SIGNIN
  // ========================================
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    try {
      GoogleSignin.configure({
        webClientId: '267093356780-61j6l12lhevi4a14q7aihook3bna9i64.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      console.log('✅ Google SignIn configurado correctamente');
    } catch (error) {
      console.error('❌ Error configurando Google SignIn:', error);
    }
  };

  // ========================================
  // 🆕 VERIFICAR SI EL USUARIO YA ESTÁ REGISTRADO
  // ========================================
  const verificarUsuarioRegistrado = async (email) => {
    try {
      console.log('🔍 Verificando si el usuario existe en BD:', email);

      // Buscar en autoridades
      const responseAutoridades = await API.get('/autoridades');
      const autoridades = responseAutoridades.data || [];
      const autoridadEncontrada = autoridades.find(
        a => a.usuario?.correo?.toLowerCase() === email.toLowerCase()
      );

     if (autoridadEncontrada) {
       console.log('✅ Usuario encontrado como AUTORIDAD');
       console.log(autoridadEncontrada);

       return {
         existe: true,
         rol: 'autoridad',
         datos: autoridadEncontrada
       };
     }

      // Buscar en transportistas
      const responseTransportistas = await API.get('/transportistas');
      const transportistas = responseTransportistas.data || [];
      const transportistaEncontrado = transportistas.find(
        t => t.usuario?.correo?.toLowerCase() === email.toLowerCase()
      );

      if (transportistaEncontrado) {
        console.log('✅ Usuario encontrado como TRANSPORTISTA');
        return {
          existe: true,
          rol: 'transportista',
          datos: transportistaEncontrado
        };
      }

      console.log('ℹ️ Usuario no registrado en BD');
      return { existe: false, rol: null, datos: null };

    } catch (error) {
      console.error('❌ Error al verificar usuario:', error);
      return { existe: false, rol: null, datos: null };
    }
  };

  // ========================================
  // LOGIN BÁSICO (Email/Password)
  // ========================================
  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert("⚠️ Campos vacíos", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, password);

      // Verificar si está registrado en la BD
      const usuario = await verificarUsuarioRegistrado(userCredential.user.email);

      if (usuario.existe) {
        // Guardar datos del usuario actual
        setCurrentUserData({
          user: userCredential.user,
          rol: usuario.rol,
          datos: usuario.datos
        });

        // Mostrar dashboard según el rol
        if (usuario.rol === 'autoridad') {
          setShowDashboardAutoridad(true);
        } else if (usuario.rol === 'transportista') {
          setShowDashboardTransportista(true);
        }

        // Pasar datos al componente padre
        if (onLoginSuccess) {
          onLoginSuccess({
            user: userCredential.user,
            rol: usuario.rol,
            datos: usuario.datos
          });
        }

      } else {
        Alert.alert(
          "⚠️ Usuario no registrado",
          "Tu cuenta de Firebase existe, pero no has completado el registro. Inicia sesión con Google para completarlo."
        );
        await signOut(auth);
      }

    } catch (error) {
      console.error("❌ Error en login:", error);

      let errorMessage = "Correo o contraseña incorrectos";

      if (error.code === 'auth/user-not-found') {
        errorMessage = "No existe una cuenta con este correo";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El correo electrónico no es válido";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "Esta cuenta ha sido deshabilitada";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos. Intenta más tarde";
      }

      Alert.alert("❌ Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOGIN CON GOOGLE - CON VERIFICACIÓN DE ROL
  // ========================================
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      console.log('🔍 Paso 1: Verificando Google Play Services...');

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });

      console.log('✅ Paso 2: Play Services disponibles');

      await GoogleSignin.signOut();
      console.log('✅ Paso 3: Sesión anterior cerrada');

      console.log('🔍 Paso 4: Iniciando Google Sign In...');
      const userInfo = await GoogleSignin.signIn();

      const googleUser = userInfo.data?.user || userInfo.user || userInfo;
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      console.log('✅ Paso 5: Usuario seleccionado:', googleUser?.email);

      if (!idToken) {
        throw new Error('No se pudo obtener el ID Token de Google');
      }

      console.log('✅ Paso 6: ID Token obtenido');

      const googleCredential = GoogleAuthProvider.credential(idToken);

      console.log('🔍 Paso 7: Autenticando con Firebase...');
      const userCredential = await signInWithCredential(auth, googleCredential);

      console.log('✅ Login exitoso con Firebase!');

      // 🆕 VERIFICAR SI YA ESTÁ REGISTRADO EN LA BASE DE DATOS
      const usuario = await verificarUsuarioRegistrado(userCredential.user.email);

      if (usuario.existe) {
        // ✅ USUARIO YA REGISTRADO - MOSTRAR DASHBOARD
        console.log('✅ Usuario ya registrado, mostrando dashboard...');

        setLoading(false);

        // Guardar datos del usuario actual
        setCurrentUserData({
          user: userCredential.user,
          rol: usuario.rol,
          datos: usuario.datos
        });

        // Mostrar el dashboard correspondiente
        if (usuario.rol === 'autoridad') {
          setShowDashboardAutoridad(true);
        } else if (usuario.rol === 'transportista') {
          setShowDashboardTransportista(true);
        }

        // Pasar datos al componente padre
        if (onLoginSuccess) {
          onLoginSuccess({
            user: userCredential.user,
            rol: usuario.rol,
            datos: usuario.datos
          });
        }

      } else {
        // ❌ USUARIO NUEVO - MOSTRAR SELECCIÓN DE ROL
        console.log('ℹ️ Usuario nuevo, mostrando selección de rol...');

        setGoogleUserData({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          phoneNumber: userCredential.user.phoneNumber,
        });

        setLoading(false);
        setShowRoleSelection(true);
      }

    } catch (error) {
      console.error('❌ Error completo:', error);

      let errorMessage = "No se pudo iniciar sesión con Google";

      if (error.code === '10') {
        errorMessage = "Error de configuración. Verifica:\n" +
                      "1. SHA-1 agregado en Firebase Console\n" +
                      "2. google-services.json actualizado\n" +
                      "3. Reconstruye la app (gradlew clean)";
      } else if (error.code === '12501') {
        errorMessage = "Inicio de sesión cancelado";
      } else if (error.code === '7') {
        errorMessage = "Error de red. Verifica tu conexión";
      }

      Alert.alert("⚠️ Error de Google Sign-In", errorMessage);
      setLoading(false);
    }
  };

  // ========================================
  // MANEJAR SELECCIÓN DE ROL COMPLETADA
  // ========================================
  const handleRoleSelectionComplete = async (data) => {
    console.log('✅ Rol seleccionado y guardado:', data);

    // Verificar nuevamente el usuario en BD para obtener datos completos
    const usuario = await verificarUsuarioRegistrado(data.email || googleUserData.email);

    setShowRoleSelection(false);

    // Guardar datos del usuario actual
    setCurrentUserData({
      user: googleUserData,
      rol: data.role,
      datos: usuario.datos || data
    });

    // Mostrar el dashboard correspondiente
    if (data.role === 'autoridad') {
      setShowDashboardAutoridad(true);
    } else if (data.role === 'transportista') {
      setShowDashboardTransportista(true);
    }

    // Pasar datos al componente padre
    if (onLoginSuccess) {
      onLoginSuccess({
        user: googleUserData,
        rol: data.role,
        datos: usuario.datos || data
      });
    }
  };

  // ========================================
  // CANCELAR SELECCIÓN DE ROL
  // ========================================
  const handleRoleSelectionCancel = async () => {
    setShowRoleSelection(false);

    // Cerrar sesión de Firebase porque no completó el registro
    await signOut(auth);

    Alert.alert(
      "⚠️ Registro Cancelado",
      "Has cancelado el registro. Por favor intenta nuevamente cuando estés listo."
    );
  };

  // ========================================
  // CERRAR DASHBOARDS
  // ========================================
  const handleCloseDashboard = () => {
    setShowDashboardAutoridad(false);
    setShowDashboardTransportista(false);
    if (onClose) onClose();
  };

  // ========================================
  // REGISTRO RÁPIDO
  // ========================================
  const handleRegister = async () => {
    if (!correo || !password) {
      Alert.alert("⚠️ Campos vacíos", "Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      Alert.alert("⚠️ Contraseña débil", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);

      Alert.alert(
        "✔️ Cuenta creada",
        "Tu cuenta de Firebase ha sido creada. Ahora inicia sesión con Google para completar tu registro.",
        [{ text: "OK" }]
      );

      console.log("✅ Usuario registrado:", userCredential.user.uid);

    } catch (error) {
      console.error("❌ Error en registro:", error);

      let errorMessage = "No se pudo crear la cuenta";

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo ya está registrado";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El correo electrónico no es válido";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil";
      }

      Alert.alert("❌ Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI - RENDER
  // ========================================
  return (
    <>
      {/* PANTALLA DE LOGIN */}
      {!showDashboardAutoridad && !showDashboardTransportista && (
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>🔐 Iniciar Sesión</Text>

            <TextInput
              placeholder="Correo electrónico"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              editable={!loading}
            />

            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            {/* BOTÓN GOOGLE */}
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#444" />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png' }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleText}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Login normal */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Ingresar</Text>
              )}
            </TouchableOpacity>

            {/* Botón de Registro */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerText}>Crear cuenta nueva</Text>
            </TouchableOpacity>

            {/* Saltar login */}
            <TouchableOpacity
              onPress={onClose}
              style={styles.skipButton}
              disabled={loading}
            >
              <Text style={styles.skipText}>Mantener sin iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL DE SELECCIÓN DE ROL (solo para usuarios nuevos) */}
      {showRoleSelection && googleUserData && (
        <RoleSelection
          visible={showRoleSelection}
          userData={googleUserData}
          onComplete={handleRoleSelectionComplete}
          onCancel={handleRoleSelectionCancel}
        />
      )}

      {/* 🔧 DASHBOARD AUTORIDAD - CORREGIDO */}
      {showDashboardAutoridad && currentUserData && (
        <DashboardAutoridad
          userData={currentUserData.user}
          datosAutoridad={currentUserData.datos}
          rol={currentUserData.rol}
          onClose={handleCloseDashboard}
        />
      )}

      {/* 🔧 DASHBOARD TRANSPORTISTA - CORREGIDO */}
      {showDashboardTransportista && currentUserData && (
        <DashboardTransportista
          userData={currentUserData.user}
          datosTransportista={currentUserData.datos}
          rol={currentUserData.rol}
          onClose={handleCloseDashboard}
        />
      )}
    </>
  );
}