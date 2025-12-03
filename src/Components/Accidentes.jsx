import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import VictimaModal from './VictimaModal';
import VehiculoModal from './VehiculoModal';
import styles from '../Styles/accidentes';

export default function Accidentes({ idAutoridad, onClose }) {
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Estados para Tipo de Accidente
  const [tiposAccidente, setTiposAccidente] = useState([]);
  const [loadingTiposAccidente, setLoadingTiposAccidente] = useState(false);
  const [tipoAccidenteId, setTipoAccidenteId] = useState('');
  const [crearNuevoTipoAccidente, setCrearNuevoTipoAccidente] = useState(false);
  const [tipoAccidenteNombre, setTipoAccidenteNombre] = useState('');
  const [tipoAccidenteDescripcion, setTipoAccidenteDescripcion] = useState('');

  // Estados para la ubicación
  const [ubicacion, setUbicacion] = useState({
    latitud: -2.9001,
    longitud: -79.0059,
    direccion: ''
  });
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);

  const [victimas, setVictimas] = useState([]);
  const [showVictimaModal, setShowVictimaModal] = useState(false);

  const [vehiculos, setVehiculos] = useState([]);
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);

  useEffect(() => {
    cargarTiposAccidente();
  }, []);

  const cargarTiposAccidente = async () => {
    setLoadingTiposAccidente(true);
    try {
      const response = await API.get('/accidentes/listarTipoAccidente');

      // Validar que la respuesta sea un array
      if (Array.isArray(response.data)) {
        setTiposAccidente(response.data);
      } else {
        console.error('Respuesta no es un array:', response.data);
        setTiposAccidente([]);
        Alert.alert('Advertencia', 'No se pudieron cargar los tipos de accidente correctamente');
      }
    } catch (error) {
      console.error('Error al cargar tipos de accidente:', error);
      setTiposAccidente([]);

      // Solo mostrar alerta si es un error real, no si simplemente no hay datos
      if (error.response?.status !== 404) {
        Alert.alert('Error', 'No se pudieron cargar los tipos de accidente');
      }
    } finally {
      setLoadingTiposAccidente(false);
    }
  };

  const handleSeleccionarTipoAccidente = (tipoId) => {
    if (tipoId === 'nuevo') {
      setCrearNuevoTipoAccidente(true);
      setTipoAccidenteId('');
      setTipoAccidenteNombre('');
      setTipoAccidenteDescripcion('');
    } else if (tipoId) {
      const tipoSeleccionado = tiposAccidente.find(t => {
        const id = t.idTipoAccidente;
        return id != null && id.toString() === tipoId.toString();
      });
      setCrearNuevoTipoAccidente(false);
      setTipoAccidenteId(tipoId);
      setTipoAccidenteNombre(tipoSeleccionado?.nombre || '');
      setTipoAccidenteDescripcion(tipoSeleccionado?.descripcion || '');
    } else {
      // Limpiar cuando no hay selección
      setCrearNuevoTipoAccidente(false);
      setTipoAccidenteId('');
      setTipoAccidenteNombre('');
      setTipoAccidenteDescripcion('');
    }
  };

  const obtenerDireccionDesdeCoordenadas = async (latitude, longitude) => {
    try {
      setLoadingAddress(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=es`,
        {
          headers: {
            'User-Agent': 'AccidentesApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      if (data.display_name) {
        const address = data.address || {};
        let direccionFormateada = '';

        if (address.road) {
          direccionFormateada += address.road;
        }
        if (address.house_number) {
          direccionFormateada += ' ' + address.house_number;
        }
        if (address.neighbourhood || address.suburb) {
          direccionFormateada += ', ' + (address.neighbourhood || address.suburb);
        }
        if (address.city || address.town) {
          direccionFormateada += ', ' + (address.city || address.town);
        }
        if (address.state) {
          direccionFormateada += ', ' + address.state;
        }
        if (address.country) {
          direccionFormateada += ', ' + address.country;
        }

        return direccionFormateada || data.display_name;
      }

      return 'Dirección no disponible';

    } catch (error) {
      console.error('Error al obtener dirección:', error);
      return 'Error al obtener dirección';
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setTempMarker({
      latitude,
      longitude
    });

    const direccionObtenida = await obtenerDireccionDesdeCoordenadas(latitude, longitude);

    setUbicacion(prev => ({
      ...prev,
      direccion: direccionObtenida
    }));
  };

  const confirmarUbicacion = () => {
    if (tempMarker) {
      setUbicacion({
        latitud: tempMarker.latitude,
        longitud: tempMarker.longitude,
        direccion: ubicacion.direccion
      });
      setShowMapModal(false);
      Alert.alert('Éxito', 'Ubicación del accidente guardada');
    } else {
      Alert.alert('Error', 'Por favor selecciona un punto en el mapa');
    }
  };

  const agregarVictima = (victima) => {
    setVictimas([...victimas, victima]);
    Alert.alert('Éxito', 'Víctima agregada');
  };

  const eliminarVictima = (id) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar esta víctima?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setVictimas(victimas.filter(v => v.id !== id))
        }
      ]
    );
  };

  const agregarVehiculo = (vehiculo) => {
    setVehiculos([...vehiculos, vehiculo]);
    Alert.alert('Éxito', 'Vehículo agregado');
  };

  const eliminarVehiculo = (id) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar este vehículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setVehiculos(vehiculos.filter(v => v.id !== id))
        }
      ]
    );
  };

  const registrarAccidente = async () => {
    // Validaciones
    if (!crearNuevoTipoAccidente && !tipoAccidenteId) {
      Alert.alert('Error', 'Debe seleccionar un tipo de accidente');
      return;
    }
    if (crearNuevoTipoAccidente && !tipoAccidenteNombre) {
      Alert.alert('Error', 'El nombre del tipo de accidente es obligatorio');
      return;
    }
    if (victimas.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos una víctima');
      return;
    }
    if (!ubicacion.latitud || !ubicacion.longitud) {
      Alert.alert('Error', 'Debe seleccionar la ubicación del accidente en el mapa');
      return;
    }

    setLoading(true);

    try {
      // ✅ CORREGIDO: Enviar el ID cuando es un tipo existente
      const payload = {
        idAutoridad: idAutoridad,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        direccion: ubicacion.direccion || '',

        // Si es nuevo tipo: solo nombre y descripción
        // Si es existente: incluir el ID
        tipoAccidente: crearNuevoTipoAccidente
          ? {
              nombre: tipoAccidenteNombre,
              descripcion: tipoAccidenteDescripcion || ''
            }
          : {
              id: tipoAccidenteId,
              nombre: tipoAccidenteNombre,
              descripcion: tipoAccidenteDescripcion || ''
            },

        victimas: victimas.map(v => ({
          nombre: v.nombre,
          apellido: v.apellido,
          cedula: v.cedula || '',
          pasaporte: v.pasaporte || '',
          genero: v.genero || '',
          edad: v.edad ? parseInt(v.edad) : 0,
          condicion: v.condicion || ''
        })),
        vehiculos: vehiculos.map(v => ({
          placa: v.placa,
          marca: v.marca,
          modelo: v.modelo || '',
          anio: v.anio ? parseInt(v.anio) : 0,
          color: v.color || '',
          capacidad: v.capacidad ? parseFloat(v.capacidad) : 0,
          npuertas: v.npuertas ? parseInt(v.npuertas) : 0,
          tipoVehiculo: {
            nombre: v.tipoVehiculoNombre,
            descripcion: v.tipoVehiculoDescripcion || '',
            categoria: v.tipoVehiculoCategoria || '',
            uso: v.tipoVehiculoUso || '',
            capacidadPersonas: v.tipoVehiculoCapacidadPersonas
              ? parseInt(v.tipoVehiculoCapacidadPersonas)
              : 0,
            capacidadCargaKg: v.tipoVehiculoCapacidadCargaKg
              ? parseFloat(v.tipoVehiculoCapacidadCargaKg)
              : null,
            nivelRiesgo: v.tipoVehiculoNivelRiesgo
              ? parseInt(v.tipoVehiculoNivelRiesgo)
              : 0
          }
        }))
      };

      console.log('Payload enviado:', JSON.stringify(payload, null, 2)); // Para debug

      const response = await API.post("/accidentes/crear", payload);

      Alert.alert(
        "Éxito",
        "Accidente registrado correctamente",
        [{ text: "OK", onPress: () => onClose && onClose() }]
      );

      limpiarFormulario();

    } catch (error) {
      console.error("Error al registrar accidente:", error);

      const mensajeError =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error desconocido";

      Alert.alert("Error", "No se pudo registrar el accidente: " + mensajeError);

    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setTipoAccidenteId('');
    setTipoAccidenteNombre('');
    setTipoAccidenteDescripcion('');
    setCrearNuevoTipoAccidente(false);
    setUbicacion({
      latitud: -2.9001,
      longitud: -79.0059,
      direccion: ''
    });
    setVictimas([]);
    setVehiculos([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Accidente</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Sección de Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación del Accidente *</Text>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              setTempMarker({
                latitude: ubicacion.latitud,
                longitude: ubicacion.longitud
              });
              setShowMapModal(true);
            }}
          >
            <Text style={styles.mapButtonText}>
              {ubicacion.latitud && ubicacion.longitud
                ? '📍 Ubicación seleccionada - Tap para cambiar'
                : '📍 Seleccionar ubicación en el mapa'}
            </Text>
          </TouchableOpacity>

          {ubicacion.latitud && ubicacion.longitud && (
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsText}>
                Lat: {ubicacion.latitud.toFixed(6)} | Lon: {ubicacion.longitud.toFixed(6)}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={ubicacion.direccion}
            onChangeText={(text) => setUbicacion({...ubicacion, direccion: text})}
            placeholder="Se autocompletará al seleccionar en el mapa"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Sección de Tipo de Accidente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Accidente</Text>

          <Text style={styles.label}>Tipo de Accidente *</Text>
          {loadingTiposAccidente ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tipoAccidenteId}
                  onValueChange={handleSeleccionarTipoAccidente}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione un tipo..." value="" />
                  {tiposAccidente.map(tipo => {
                    const id = tipo.idtipoAccidente;
                    if (id == null) return null;
                    return (
                      <Picker.Item
                        key={id}
                        label={tipo.nombre || 'Sin nombre'}
                        value={id.toString()}
                      />
                    );
                  })}
                  <Picker.Item label="+ Crear nuevo tipo" value="nuevo" />
                </Picker>
              </View>

              {crearNuevoTipoAccidente && (
                <View style={styles.nuevoTipoContainer}>
                  <Text style={styles.nuevoTipoTitle}>Nuevo Tipo de Accidente</Text>
                  <TextInput
                    style={styles.input}
                    value={tipoAccidenteNombre}
                    onChangeText={setTipoAccidenteNombre}
                    placeholder="Nombre del tipo *"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={tipoAccidenteDescripcion}
                    onChangeText={setTipoAccidenteDescripcion}
                    placeholder="Descripción del tipo..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              )}
            </>
          )}

          {!crearNuevoTipoAccidente && tipoAccidenteId && (
            <>
              <Text style={styles.label}>Descripción Adicional (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={tipoAccidenteDescripcion}
                onChangeText={setTipoAccidenteDescripcion}
                placeholder="Añadir detalles adicionales..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </>
          )}
        </View>

        {/* Sección de Víctimas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Víctimas ({victimas.length}) *</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowVictimaModal(true)}
            >
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {victimas.map((victima) => (
            <View key={victima.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  {victima.nombre} {victima.apellido}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {victima.cedula || victima.pasaporte} | {victima.genero}
                  {victima.edad && ` | ${victima.edad} años`}
                  {victima.condicion && ` | ${victima.condicion}`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => eliminarVictima(victima.id)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sección de Vehículos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehículos ({vehiculos.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowVehiculoModal(true)}
            >
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {vehiculos.map((vehiculo) => (
            <View key={vehiculo.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  {vehiculo.placa} - {vehiculo.marca}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {vehiculo.modelo} {vehiculo.anio && `| ${vehiculo.anio}`} {vehiculo.color && `| ${vehiculo.color}`}
                </Text>
                <Text style={styles.itemSubtitle}>
                  Tipo: {vehiculo.tipoVehiculoNombre}
                </Text>
              </View>
              <TouchableOpacity onPress={() => eliminarVehiculo(vehiculo.id)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={registrarAccidente}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Registrar Accidente</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal del Mapa */}
      <Modal visible={showMapModal} transparent animationType="slide">
        <View style={styles.mapModalOverlay}>
          <View style={styles.mapModalContent}>
            <Text style={styles.modalTitle}>Selecciona la ubicación del accidente</Text>
            <Text style={styles.mapInstructions}>Toca en el mapa para marcar el lugar exacto</Text>

            {loadingAddress && (
              <View style={styles.loadingAddressContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingAddressText}>Obteniendo dirección...</Text>
              </View>
            )}

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: tempMarker?.latitude || ubicacion.latitud,
                longitude: tempMarker?.longitude || ubicacion.longitud,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              {tempMarker && (
                <Marker
                  coordinate={tempMarker}
                  title="Ubicación del accidente"
                  pinColor="red"
                />
              )}
            </MapView>

            {tempMarker && ubicacion.direccion && (
              <View style={styles.addressPreview}>
                <Text style={styles.addressPreviewTitle}>📍 Dirección detectada:</Text>
                <Text style={styles.addressPreviewText}>{ubicacion.direccion}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowMapModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={confirmarUbicacion}
                disabled={loadingAddress}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Víctimas */}
      <VictimaModal
        visible={showVictimaModal}
        onClose={() => setShowVictimaModal(false)}
        onAgregar={agregarVictima}
      />

      {/* Modal de Vehículos */}
      <VehiculoModal
        visible={showVehiculoModal}
        onClose={() => setShowVehiculoModal(false)}
        onAgregar={agregarVehiculo}
      />
    </View>
  );
}