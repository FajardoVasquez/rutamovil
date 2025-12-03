import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';

export default function Perfil({ visible, onClose, userData, datosAutoridad }) {
  // 🔍 Debug para ver qué datos recibimos
  console.log('🔍 Perfil Modal - userData:', userData);
  console.log('🔍 Perfil Modal - datosAutoridad:', datosAutoridad);

  // 🛑 EVITAR QUE EL MODAL SE ABRA VACÍO
  if (visible && (!userData || !datosAutoridad)) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#0084FF" />
            <Text style={{ marginTop: 10, fontSize: 16 }}>Cargando perfil...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // 🔍 Extraer datos del usuario de forma más robusta
  const nombreCompleto = userData?.displayName ||
                         datosAutoridad?.usuario?.nombre ||
                         'Usuario';

  const apellido = datosAutoridad?.usuario?.apellido || '';
  const nombreCompletoFinal = apellido ? `${nombreCompleto} ${apellido}` : nombreCompleto;

  const email = userData?.email ||
                datosAutoridad?.usuario?.correo ||
                'No disponible';

  const telefono = datosAutoridad?.usuario?.telefono || 'No disponible';
  const cedula = datosAutoridad?.usuario?.cedula || 'No disponible';
  const pasaporte = datosAutoridad?.usuario?.pasaporte || 'No tiene';
  const sexo = datosAutoridad?.usuario?.sexo === 'M' ? 'Masculino' :
               datosAutoridad?.usuario?.sexo === 'F' ? 'Femenino' : 'No especificado';

  // Datos de la autoridad
  const cargo = datosAutoridad?.cargo || 'No especificado';
  const regionOpera = datosAutoridad?.regionOpera || 'No especificado';
  const credencial = datosAutoridad?.credencial || 'No especificado';

  const institucion = datosAutoridad?.institucion?.nombreInstitucion || 'No especificado';
  const direccionInstitucion = datosAutoridad?.institucion?.direccionInstitucion || 'No especificado';
  const telefonoInstitucion = datosAutoridad?.institucion?.telefono || 'No disponible';
  const correoInstitucion = datosAutoridad?.institucion?.correo || 'No disponible';
  const rucInstitucion = datosAutoridad?.rucInstitucion || 'No disponible';

  const fechaIncorporacion = datosAutoridad?.fechaIncorporacion || 'No disponible';
  const fechaNacimiento = datosAutoridad?.usuario?.fechaNacimiento || 'No disponible';

  const fotoUrl = userData?.photoURL || userData?.providerData?.[0]?.photoURL || null;

  console.log('📊 Datos extraídos:', {
    nombreCompletoFinal,
    email,
    telefono,
    cedula,
    cargo,
    institucion
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>👤 Mi Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* CONTENIDO */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>

            {/* FOTO */}
            <View style={styles.profileImageContainer}>
              {fotoUrl ? (
                <Image source={{ uri: fotoUrl }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImagePlaceholderText}>
                    {nombreCompletoFinal.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <Text style={styles.profileName}>{nombreCompletoFinal}</Text>
              <Text style={styles.profileRole}>{cargo}</Text>
              <Text style={styles.profileInstitution}>{institucion}</Text>
            </View>

            {/* INFORMACIÓN PERSONAL */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Información Personal</Text>

              <InfoItem icon="👤" label="Nombre Completo" value={nombreCompletoFinal} />
              <InfoItem icon="📧" label="Email" value={email} />
              <InfoItem icon="📱" label="Teléfono" value={telefono} />
              <InfoItem icon="🆔" label="Cédula" value={cedula} />
              {pasaporte !== 'No tiene' && (
                <InfoItem icon="🛂" label="Pasaporte" value={pasaporte} />
              )}
              <InfoItem icon="⚧️" label="Sexo" value={sexo} />
              <InfoItem icon="🎂" label="Fecha de Nacimiento" value={formatearFecha(fechaNacimiento)} />
            </View>

            {/* INFORMACIÓN LABORAL */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💼 Información Laboral</Text>
              <InfoItem icon="🏢" label="Institución" value={institucion} />
              <InfoItem icon="👔" label="Cargo" value={cargo} />
              <InfoItem icon="🌎" label="Región de Operación" value={regionOpera} />
              <InfoItem icon="🆔" label="Credencial" value={credencial} />
              <InfoItem icon="📅" label="Fecha de Incorporación" value={formatearFecha(fechaIncorporacion)} />
            </View>

            {/* INSTITUCIÓN */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏛️ Datos de la Institución</Text>
              <InfoItem icon="🏢" label="Nombre" value={institucion} />
              <InfoItem icon="📍" label="Dirección" value={direccionInstitucion} />
              <InfoItem icon="📞" label="Teléfono" value={telefonoInstitucion.toString()} />
              <InfoItem icon="📧" label="Correo" value={correoInstitucion} />
              <InfoItem icon="🧾" label="RUC" value={rucInstitucion} />
            </View>

            {/* ADICIONAL */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ℹ️ Información Adicional</Text>

              <InfoItem icon="🔐" label="ID de Autoridad" value={datosAutoridad?.idAutoridad?.toString()} />
              <InfoItem icon="🆔" label="ID de Usuario" value={datosAutoridad?.usuario?.idusuario?.toString()} />
              <InfoItem icon="🔑" label="UID Firebase" value={userData?.uid} />
              <InfoItem
                icon="✅"
                label="Estado"
                value={datosAutoridad?.usuario?.estado ? 'Activo' : 'Inactivo'}
              />
            </View>

            {/* BOTÓN EDIT */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => alert('Función de edición en desarrollo')}
            >
              <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// 🎯 FORMAT FECHAS
function formatearFecha(fecha) {
  if (!fecha || fecha === 'No disponible') return 'No disponible';
  try {
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
      return fechaObj.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return fecha.toString();
  } catch {
    return fecha.toString();
  }
}

// 🧩 COMPONENTE REUTILIZADO
function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Text style={styles.infoIcon}>{icon}</Text>
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  // HEADER
  modalHeader: {
    backgroundColor: '#0084FF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // CONTENIDO
  modalContent: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // FOTO DE PERFIL
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E5EC',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#0084FF',
    marginBottom: 15,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#E0E5EC',
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B3A57',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#52606D',
    fontWeight: '500',
    marginBottom: 3,
  },
  profileInstitution: {
    fontSize: 14,
    color: '#0084FF',
    fontWeight: '600',
  },

  // SECCIONES
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B3A57',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0084FF',
  },

  // INFO ITEMS
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#667781',
    marginBottom: 3,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1B3A57',
    fontWeight: '600',
  },

  // BOTÓN EDITAR
  editButton: {
    backgroundColor: '#0084FF',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});