import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import styles from '../Styles/accidentes';

export default function VictimaModal({ visible, onClose, onAgregar }) {
  const [victimaActual, setVictimaActual] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    pasaporte: '',
    genero: '',
    edad: '',
    condicion: '',
    tipoDocumento: 'cedula' // 'cedula' o 'pasaporte'
  });

  const handleAgregar = () => {
    if (!victimaActual.nombre || !victimaActual.apellido) {
      Alert.alert('Error', 'Nombre y apellido son obligatorios');
      return;
    }

    if (victimaActual.tipoDocumento === 'cedula' && !victimaActual.cedula) {
      Alert.alert('Error', 'Debe ingresar la cédula');
      return;
    }

    if (victimaActual.tipoDocumento === 'pasaporte' && !victimaActual.pasaporte) {
      Alert.alert('Error', 'Debe ingresar el pasaporte');
      return;
    }

    if (!victimaActual.genero) {
      Alert.alert('Error', 'Debe seleccionar el género');
      return;
    }

    // Limpiar el documento no usado
    const victimaFinal = {
      ...victimaActual,
      cedula: victimaActual.tipoDocumento === 'cedula' ? victimaActual.cedula : '',
      pasaporte: victimaActual.tipoDocumento === 'pasaporte' ? victimaActual.pasaporte : '',
      id: Date.now()
    };

    onAgregar(victimaFinal);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setVictimaActual({
      nombre: '',
      apellido: '',
      cedula: '',
      pasaporte: '',
      genero: '',
      edad: '',
      condicion: '',
      tipoDocumento: 'cedula'
    });
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Víctima</Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              value={victimaActual.nombre}
              onChangeText={(text) => setVictimaActual({...victimaActual, nombre: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido *"
              value={victimaActual.apellido}
              onChangeText={(text) => setVictimaActual({...victimaActual, apellido: text})}
            />

            {/* Selector de tipo de documento */}
            <Text style={styles.label}>Tipo de Documento *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  victimaActual.tipoDocumento === 'cedula' && styles.radioButtonSelected
                ]}
                onPress={() => setVictimaActual({...victimaActual, tipoDocumento: 'cedula', pasaporte: ''})}
              >
                <View style={styles.radioCircle}>
                  {victimaActual.tipoDocumento === 'cedula' && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioLabel}>Cédula</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  victimaActual.tipoDocumento === 'pasaporte' && styles.radioButtonSelected
                ]}
                onPress={() => setVictimaActual({...victimaActual, tipoDocumento: 'pasaporte', cedula: ''})}
              >
                <View style={styles.radioCircle}>
                  {victimaActual.tipoDocumento === 'pasaporte' && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioLabel}>Pasaporte</Text>
              </TouchableOpacity>
            </View>

            {/* Campo condicional según tipo de documento */}
            {victimaActual.tipoDocumento === 'cedula' ? (
              <TextInput
                style={styles.input}
                placeholder="Cédula *"
                value={victimaActual.cedula}
                onChangeText={(text) => setVictimaActual({...victimaActual, cedula: text})}
                keyboardType="numeric"
                maxLength={10}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Pasaporte *"
                value={victimaActual.pasaporte}
                onChangeText={(text) => setVictimaActual({...victimaActual, pasaporte: text})}
              />
            )}

            {/* Selector de género */}
            <Text style={styles.label}>Género *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  victimaActual.genero === 'Masculino' && styles.radioButtonSelected
                ]}
                onPress={() => setVictimaActual({...victimaActual, genero: 'Masculino'})}
              >
                <View style={styles.radioCircle}>
                  {victimaActual.genero === 'Masculino' && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioLabel}>Masculino</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  victimaActual.genero === 'Femenino' && styles.radioButtonSelected
                ]}
                onPress={() => setVictimaActual({...victimaActual, genero: 'Femenino'})}
              >
                <View style={styles.radioCircle}>
                  {victimaActual.genero === 'Femenino' && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioLabel}>Femenino</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={victimaActual.edad}
              onChangeText={(text) => setVictimaActual({...victimaActual, edad: text})}
              keyboardType="numeric"
              maxLength={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Condición (Ej: Ileso, Herido leve, Herido grave, Fallecido)"
              value={victimaActual.condicion}
              onChangeText={(text) => setVictimaActual({...victimaActual, condicion: text})}
            />
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