// TransportistaForm.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from "../services/api";
import styles from '../Styles/TransportistaForm';

export default function TransportistaForm({ visible, userData, onComplete, onCancel }) {
  // Estados para Usuario
  const [tipoDocumento, setTipoDocumento] = useState('cedula'); // 'cedula' o 'pasaporte'
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState(userData.phoneNumber || '');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Estados para Transportista
  const [preferenciaNotificacion, setPreferenciaNotificacion] = useState('');
  const [frecuenciaAlertas, setFrecuenciaAlertas] = useState('');

  const [loading, setLoading] = useState(false);

  const validarCampos = () => {
    // Validar documento de identidad
    if (!numeroDocumento) {
      Alert.alert(
        "⚠️ Campo incompleto",
        `Por favor ingresa tu ${tipoDocumento === 'cedula' ? 'cédula' : 'pasaporte'}`
      );
      return false;
    }

    if (tipoDocumento === 'cedula' && numeroDocumento.length !== 10) {
      Alert.alert("⚠️ Cédula inválida", "La cédula debe tener 10 dígitos");
      return false;
    }

    if (!sexo) {
      Alert.alert("⚠️ Campo incompleto", "Por favor selecciona el sexo");
      return false;
    }

    if (!preferenciaNotificacion) {
      Alert.alert("⚠️ Campo incompleto", "Selecciona tu preferencia de notificación");
      return false;
    }

    if (!frecuenciaAlertas) {
      Alert.alert("⚠️ Campo incompleto", "Selecciona la frecuencia de alertas");
      return false;
    }

    // Validar fecha de nacimiento si se ingresó
    if (dia || mes || anio) {
      if (!dia || !mes || !anio) {
        Alert.alert("⚠️ Fecha incompleta", "Completa día, mes y año de nacimiento");
        return false;
      }
      const diaNum = parseInt(dia);
      const mesNum = parseInt(mes);
      const anioNum = parseInt(anio);

      if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 ||
          anioNum < 1900 || anioNum > new Date().getFullYear()) {
        Alert.alert("⚠️ Fecha inválida", "Verifica los valores de la fecha");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    try {
      // Construir fecha de nacimiento si se proporcionó
      let fechaNacimientoISO = null;
      if (dia && mes && anio) {
        const mesFormateado = mes.padStart(2, '0');
        const diaFormateado = dia.padStart(2, '0');
        fechaNacimientoISO = `${anio}-${mesFormateado}-${diaFormateado}`;
      }

      const payload = {
        usuario: {
          nombre: userData.displayName?.split(" ")[0] || "",
          apellido: userData.displayName?.split(" ").slice(1).join(" ") || "",
          correo: userData.email,
          telefono: telefono,
          cedula: tipoDocumento === 'cedula' ? numeroDocumento : null,
          pasaporte: tipoDocumento === 'pasaporte' ? numeroDocumento : null,
          sexo: sexo,
          estado: true,
          fechaNacimiento: fechaNacimientoISO,
          ultimoAcceso: new Date().toISOString(),
          contrasena: contrasena || null
        },
        preferenciaNotificacion: preferenciaNotificacion,
        frecuenciaAlertas: frecuenciaAlertas
      };

      console.log("Enviando payload:", JSON.stringify(payload, null, 2));

      const response = await API.post("/transportistas/crearcompleto", payload);

      Alert.alert(
        "✔️ Registro Exitoso",
        "Datos de transportista guardados correctamente"
      );
      onComplete(response.data);

    } catch (error) {
      console.error("❌ Error al registrar transportista:", error);
      console.error("Detalles del error:", error.response?.data);

      const mensajeError = error.response?.data?.message ||
                          error.response?.data ||
                          "No se pudo guardar el registro";

      Alert.alert("❌ Error", mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.formBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>🚛 Registro de Transportista</Text>

            {/* ==== DATOS DE GOOGLE ==== */}
            <View style={styles.userBox}>
              {userData.photoURL && (
                <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
              )}
              <Text style={styles.userText}>👤 {userData.displayName}</Text>
              <Text style={styles.userText}>📧 {userData.email}</Text>
            </View>

            {/* ==== SECCIÓN: DATOS PERSONALES ==== */}
            <Text style={styles.sectionTitle}>📋 Datos Personales</Text>

            {/* Selector de tipo de documento */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoDocumento}
                onValueChange={(value) => {
                  setTipoDocumento(value);
                  setNumeroDocumento(''); // Limpiar el número al cambiar tipo
                }}
                style={styles.picker}
              >
                <Picker.Item label="🆔 Cédula" value="cedula" />
                <Picker.Item label="🛂 Pasaporte" value="pasaporte" />
              </Picker>
            </View>

            <TextInput
              placeholder={tipoDocumento === 'cedula' ? "Número de Cédula *" : "Número de Pasaporte *"}
              style={styles.input}
              keyboardType={tipoDocumento === 'cedula' ? "numeric" : "default"}
              value={numeroDocumento}
              onChangeText={setNumeroDocumento}
              maxLength={tipoDocumento === 'cedula' ? 10 : 20}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sexo}
                onValueChange={(value) => setSexo(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona Sexo *" value="" />
                <Picker.Item label="Masculino" value="M" />
                <Picker.Item label="Femenino" value="F" />
              </Picker>
            </View>

            <TextInput
              placeholder="Teléfono"
              style={styles.input}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              maxLength={10}
            />

            <Text style={styles.labelText}>Fecha de Nacimiento (opcional)</Text>
            <View style={styles.dateRow}>
              <TextInput
                placeholder="Día"
                style={[styles.input, styles.dateInput]}
                keyboardType="numeric"
                value={dia}
                onChangeText={setDia}
                maxLength={2}
              />
              <TextInput
                placeholder="Mes"
                style={[styles.input, styles.dateInput]}
                keyboardType="numeric"
                value={mes}
                onChangeText={setMes}
                maxLength={2}
              />
              <TextInput
                placeholder="Año"
                style={[styles.input, styles.dateInput]}
                keyboardType="numeric"
                value={anio}
                onChangeText={setAnio}
                maxLength={4}
              />
            </View>

            <TextInput
              placeholder="Contraseña (opcional)"
              style={styles.input}
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
            />

            {/* ==== SECCIÓN: CONFIGURACIÓN DE NOTIFICACIONES ==== */}
            <Text style={styles.sectionTitle}>🔔 Configuración de Notificaciones</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={preferenciaNotificacion}
                onValueChange={(value) => setPreferenciaNotificacion(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona preferencia de notificación *" value="" />
                <Picker.Item label="📧 Email" value="email" />
                <Picker.Item label="📱 SMS" value="sms" />
                <Picker.Item label="🔔 Push" value="push" />
                <Picker.Item label="📧📱 Email y SMS" value="email_sms" />
                <Picker.Item label="📧🔔 Email y Push" value="email_push" />
                <Picker.Item label="🔕 Ninguna" value="ninguna" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={frecuenciaAlertas}
                onValueChange={(value) => setFrecuenciaAlertas(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona frecuencia de alertas *" value="" />
                <Picker.Item label="⚡ Instantánea" value="instantanea" />
                <Picker.Item label="📅 Diaria" value="diaria" />
                <Picker.Item label="📆 Semanal" value="semanal" />
                <Picker.Item label="📊 Mensual" value="mensual" />
                <Picker.Item label="🔕 Solo críticas" value="solo_criticas" />
              </Picker>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ Las notificaciones te mantendrán informado sobre el estado de tus envíos y alertas importantes.
              </Text>
            </View>

            {/* ==== BOTONES ==== */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>💾 Guardar Registro</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>❌ Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}