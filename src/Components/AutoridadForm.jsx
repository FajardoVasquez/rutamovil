// AutoridadForm.jsx
import React, { useState, useEffect } from 'react';
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
import styles from '../Styles/AutoridadForm';

export default function AutoridadForm({ visible, userData, onComplete, onCancel }) {
  // Estados para Usuario
  const [tipoDocumento, setTipoDocumento] = useState('cedula'); // 'cedula' o 'pasaporte'
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState(userData.phoneNumber || '');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Estados para Institución
  const [instituciones, setInstituciones] = useState([]);
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState('');
  const [mostrarNuevaInstitucion, setMostrarNuevaInstitucion] = useState(false);
  const [nuevaInstitucion, setNuevaInstitucion] = useState({
    nombreInstitucion: '',
    direccionInstitucion: '',
    telefono: '',
    correo: ''
  });

  // Estados para Autoridad
  const [cargo, setCargo] = useState('');
  const [regionOpera, setRegionOpera] = useState('');
  const [credencial, setCredencial] = useState('');
  const [rucInstitucion, setRucInstitucion] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);

  // Cargar instituciones al abrir el formulario
  useEffect(() => {
    if (visible) {
      cargarInstituciones();
    }
  }, [visible]);

  const cargarInstituciones = async () => {
    setLoadingInstituciones(true);
    try {
      const response = await API.get("/autoridades/listarInstituciones");

      if (response.data && Array.isArray(response.data)) {
        setInstituciones(response.data);
        if (response.data.length === 0) {
          setMostrarNuevaInstitucion(true);
        }
      } else {
        setInstituciones([]);
        setMostrarNuevaInstitucion(true);
      }
    } catch (error) {
      console.error("Error al cargar instituciones:", error);

      if (error.response?.status === 404) {
        setInstituciones([]);
        setMostrarNuevaInstitucion(true);
      } else {
        Alert.alert(
          "⚠️ Aviso",
          "No se pudieron cargar las instituciones. Puedes crear una nueva."
        );
        setInstituciones([]);
        setMostrarNuevaInstitucion(true);
      }
    } finally {
      setLoadingInstituciones(false);
    }
  };

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

    if (!sexo || !cargo || !regionOpera) {
      Alert.alert(
        "⚠️ Campos incompletos",
        "Por favor completa todos los campos obligatorios"
      );
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

    // Validar institución
    if (!mostrarNuevaInstitucion && !institucionSeleccionada && instituciones.length > 0) {
      Alert.alert("⚠️ Institución requerida", "Selecciona o crea una institución");
      return false;
    }

    if (mostrarNuevaInstitucion || instituciones.length === 0) {
      if (!nuevaInstitucion.nombreInstitucion || !nuevaInstitucion.direccionInstitucion) {
        Alert.alert(
          "⚠️ Datos de institución incompletos",
          "Completa los datos de la nueva institución"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    try {
      let institucionData;

      // Si se está creando una nueva institución o no hay instituciones
      if (mostrarNuevaInstitucion || instituciones.length === 0) {
        institucionData = {
          nombreInstitucion: nuevaInstitucion.nombreInstitucion,
          direccionInstitucion: nuevaInstitucion.direccionInstitucion,
          telefono: parseInt(nuevaInstitucion.telefono) || 0,
          correo: nuevaInstitucion.correo || userData.email
        };
      } else {
        // Buscar la institución seleccionada
        const inst = instituciones.find(
          i => i.idInstitucion === parseInt(institucionSeleccionada)
        );
        institucionData = {
          nombreInstitucion: inst.nombreInstitucion,
          direccionInstitucion: inst.direccionInstitucion,
          telefono: inst.telefono,
          correo: inst.correo
        };
      }

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
        institucion: institucionData,
        cargo: cargo,
        regionOpera: regionOpera,
        credencial: credencial || null,
        rucInstitucion: rucInstitucion || null,
        fechaIncorporacion: new Date().toISOString()
      };

      console.log("Enviando payload:", JSON.stringify(payload, null, 2));

      const response = await API.post("/autoridades/crearcompleto", payload);
      Alert.alert(
        "✔️ Registro Exitoso",
        "Datos de autoridad guardados correctamente"
      );
      onComplete(response.data);

    } catch (error) {
      console.error("❌ Error al registrar autoridad:", error);
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
            <Text style={styles.title}>🏛️ Registro de Autoridad</Text>

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

            {/* ==== SECCIÓN: INSTITUCIÓN ==== */}
            <Text style={styles.sectionTitle}>🏢 Institución</Text>

            {loadingInstituciones ? (
              <ActivityIndicator size="small" color="#007AFF" style={{marginVertical: 20}} />
            ) : (
              <>
                {!mostrarNuevaInstitucion && instituciones.length > 0 ? (
                  <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={institucionSeleccionada}
                        onValueChange={(value) => setInstitucionSeleccionada(value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Selecciona una institución *" value="" />
                        {instituciones.map((inst) => (
                          <Picker.Item
                            key={inst.idInstitucion}
                            label={inst.nombreInstitucion}
                            value={inst.idInstitucion.toString()}
                          />
                        ))}
                      </Picker>
                    </View>

                    <TouchableOpacity
                      style={styles.newInstButton}
                      onPress={() => setMostrarNuevaInstitucion(true)}
                    >
                      <Text style={styles.newInstButtonText}>➕ Crear Nueva Institución</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {instituciones.length === 0 && (
                      <Text style={styles.infoText}>
                        ℹ️ No hay instituciones registradas. Crea una nueva:
                      </Text>
                    )}

                    <TextInput
                      placeholder="Nombre de la Institución *"
                      style={styles.input}
                      value={nuevaInstitucion.nombreInstitucion}
                      onChangeText={(text) =>
                        setNuevaInstitucion({...nuevaInstitucion, nombreInstitucion: text})
                      }
                    />

                    <TextInput
                      placeholder="Dirección *"
                      style={styles.input}
                      value={nuevaInstitucion.direccionInstitucion}
                      onChangeText={(text) =>
                        setNuevaInstitucion({...nuevaInstitucion, direccionInstitucion: text})
                      }
                    />

                    <TextInput
                      placeholder="Teléfono de la Institución"
                      style={styles.input}
                      keyboardType="phone-pad"
                      value={nuevaInstitucion.telefono}
                      onChangeText={(text) =>
                        setNuevaInstitucion({...nuevaInstitucion, telefono: text})
                      }
                    />

                    <TextInput
                      placeholder="Correo de la Institución"
                      style={styles.input}
                      keyboardType="email-address"
                      value={nuevaInstitucion.correo}
                      onChangeText={(text) =>
                        setNuevaInstitucion({...nuevaInstitucion, correo: text})
                      }
                    />

                    {instituciones.length > 0 && (
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setMostrarNuevaInstitucion(false)}
                      >
                        <Text style={styles.backButtonText}>
                          ⬅️ Volver a lista de instituciones
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </>
            )}

            {/* ==== SECCIÓN: DATOS DE AUTORIDAD ==== */}
            <Text style={styles.sectionTitle}>👔 Datos del Cargo</Text>

            <TextInput
              placeholder="Cargo *"
              style={styles.input}
              value={cargo}
              onChangeText={setCargo}
            />

            <TextInput
              placeholder="Región donde opera *"
              style={styles.input}
              value={regionOpera}
              onChangeText={setRegionOpera}
            />

            <TextInput
              placeholder="Credencial (opcional)"
              style={styles.input}
              value={credencial}
              onChangeText={setCredencial}
            />

            <TextInput
              placeholder="RUC de la Institución (opcional)"
              style={styles.input}
              keyboardType="numeric"
              value={rucInstitucion}
              onChangeText={setRucInstitucion}
              maxLength={13}
            />

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