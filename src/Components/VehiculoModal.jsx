import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../services/api';
import styles from '../Styles/accidentes';

export default function VehiculoModal({ visible, onClose, onAgregar }) {
  const [vehiculoActual, setVehiculoActual] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    capacidad: '',
    npuertas: '',
    tipoVehiculoId: '',
    tipoVehiculoNombre: '',
    // Campos para crear nuevo tipo
    tipoVehiculoDescripcion: '',
    tipoVehiculoCategoria: '',
    tipoVehiculoUso: '',
    tipoVehiculoCapacidadPersonas: '',
    tipoVehiculoCapacidadCargaKg: '',
    tipoVehiculoNivelRiesgo: ''
  });

  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [crearNuevoTipo, setCrearNuevoTipo] = useState(false);

  useEffect(() => {
    if (visible) {
      cargarTiposVehiculo();
    }
  }, [visible]);

  const cargarTiposVehiculo = async () => {
    setLoadingTipos(true);
    try {
      const response = await API.get('/accidentes/listarTipoVehiculo');

      // Validar que la respuesta sea un array
      if (Array.isArray(response.data)) {
        setTiposVehiculo(response.data);
      } else {
        console.error('Respuesta no es un array:', response.data);
        setTiposVehiculo([]);
        Alert.alert('Advertencia', 'No se pudieron cargar los tipos de vehículo correctamente');
      }
    } catch (error) {
      console.error('Error al cargar tipos de vehículo:', error);
      setTiposVehiculo([]);

      // Solo mostrar alerta si es un error real, no si simplemente no hay datos
      if (error.response?.status !== 404) {
        Alert.alert('Error', 'No se pudieron cargar los tipos de vehículo');
      }
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleSeleccionarTipo = (tipoId) => {
    if (tipoId === 'nuevo') {
      setCrearNuevoTipo(true);
      setVehiculoActual({
        ...vehiculoActual,
        tipoVehiculoId: '',
        tipoVehiculoNombre: ''
      });
    } else if (tipoId) {
      const tipoSeleccionado = tiposVehiculo.find(t => {
        const id = t.idTipoVehiculo;
        return id != null && id.toString() === tipoId.toString();
      });
      setCrearNuevoTipo(false);
      setVehiculoActual({
        ...vehiculoActual,
        tipoVehiculoId: tipoId,
        tipoVehiculoNombre: tipoSeleccionado?.nombre || ''
      });
    } else {
      // Limpiar cuando no hay selección
      setCrearNuevoTipo(false);
      setVehiculoActual({
        ...vehiculoActual,
        tipoVehiculoId: '',
        tipoVehiculoNombre: ''
      });
    }
  };

  const handleAgregar = () => {
    // Validaciones básicas
    if (!vehiculoActual.placa || !vehiculoActual.marca) {
      Alert.alert('Error', 'Placa y marca son obligatorios');
      return;
    }

    if (!crearNuevoTipo && !vehiculoActual.tipoVehiculoId) {
      Alert.alert('Error', 'Debe seleccionar un tipo de vehículo');
      return;
    }

    if (crearNuevoTipo && !vehiculoActual.tipoVehiculoNombre) {
      Alert.alert('Error', 'Debe ingresar el nombre del tipo de vehículo');
      return;
    }

    const vehiculoFinal = {
      ...vehiculoActual,
      id: Date.now(),
      esNuevoTipo: crearNuevoTipo
    };

    onAgregar(vehiculoFinal);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setVehiculoActual({
      placa: '',
      marca: '',
      modelo: '',
      anio: '',
      color: '',
      capacidad: '',
      npuertas: '',
      tipoVehiculoId: '',
      tipoVehiculoNombre: '',
      tipoVehiculoDescripcion: '',
      tipoVehiculoCategoria: '',
      tipoVehiculoUso: '',
      tipoVehiculoCapacidadPersonas: '',
      tipoVehiculoCapacidadCargaKg: '',
      tipoVehiculoNivelRiesgo: ''
    });
    setCrearNuevoTipo(false);
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Vehículo</Text>

          <ScrollView>
            <Text style={styles.sectionSubtitle}>Datos del Vehículo</Text>

            <TextInput
              style={styles.input}
              placeholder="Placa *"
              value={vehiculoActual.placa}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, placa: text.toUpperCase()})}
              autoCapitalize="characters"
            />

            <TextInput
              style={styles.input}
              placeholder="Marca *"
              value={vehiculoActual.marca}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, marca: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Modelo"
              value={vehiculoActual.modelo}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, modelo: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Año"
              value={vehiculoActual.anio}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, anio: text})}
              keyboardType="numeric"
              maxLength={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Color"
              value={vehiculoActual.color}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, color: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Capacidad"
              value={vehiculoActual.capacidad}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, capacidad: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Número de puertas"
              value={vehiculoActual.npuertas}
              onChangeText={(text) => setVehiculoActual({...vehiculoActual, npuertas: text})}
              keyboardType="numeric"
            />

            <Text style={styles.sectionSubtitle}>Tipo de Vehículo *</Text>

            {loadingTipos ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={vehiculoActual.tipoVehiculoId}
                    onValueChange={handleSeleccionarTipo}
                    style={styles.picker}
                  >
                    <Picker.Item label="Seleccione un tipo..." value="" />
                    {tiposVehiculo.map(tipo => {
                      const id = tipo.idTipoVehiculo;
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

                {crearNuevoTipo && (
                  <View style={styles.nuevoTipoContainer}>
                    <Text style={styles.nuevoTipoTitle}>Nuevo Tipo de Vehículo</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Nombre del tipo *"
                      value={vehiculoActual.tipoVehiculoNombre}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoNombre: text})}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Descripción"
                      value={vehiculoActual.tipoVehiculoDescripcion}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoDescripcion: text})}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Categoría (Ej: Liviano, Pesado)"
                      value={vehiculoActual.tipoVehiculoCategoria}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoCategoria: text})}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Uso (Ej: Particular, Comercial, Transporte público)"
                      value={vehiculoActual.tipoVehiculoUso}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoUso: text})}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Capacidad de personas"
                      value={vehiculoActual.tipoVehiculoCapacidadPersonas}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoCapacidadPersonas: text})}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Capacidad de carga (kg)"
                      value={vehiculoActual.tipoVehiculoCapacidadCargaKg}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoCapacidadCargaKg: text})}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Nivel de riesgo (1-10)"
                      value={vehiculoActual.tipoVehiculoNivelRiesgo}
                      onChangeText={(text) => setVehiculoActual({...vehiculoActual, tipoVehiculoNivelRiesgo: text})}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={handleClose}
            >
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAgregar}>
              <Text style={styles.modalButtonTextConfirm}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}