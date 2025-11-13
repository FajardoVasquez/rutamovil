import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import Login from './Login';

import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAV96rDqSM8Icz5o3H-a6mcfrWLfWjwvUc';

export default function MapaRutas() {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [destino, setDestino] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [buscandoRuta, setBuscandoRuta] = useState(false);
  const [modoTransporte, setModoTransporte] = useState('DRIVING');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState([]);
  const [infoRuta, setInfoRuta] = useState(null);
  const [siguiendoRuta, setSiguiendoRuta] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [menuExpandido, setMenuExpandido] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false); // ✅ Estado del modal
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Lugares populares de Ecuador
  const lugaresPopulares = [
    'Chordeleg, Azuay',
    'Gualaceo, Azuay',
    'Sigsig, Azuay',
    'Mitad del Mundo, Quito',
    'Parque La Carolina, Quito',
    'Centro Histórico de Quito',
    'TelefériQo, Quito',
    'Malecón 2000, Guayaquil',
    'Parque de las Iguanas, Guayaquil',
    'Cuenca Centro Histórico',
    'Baños de Agua Santa',
    'Otavalo',
  ];

  useEffect(() => {
    requestLocationPermission();

    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // ✅ Mostrar login después de 5 segundos
    const timer = setTimeout(() => {
      setMostrarLogin(true);
    }, 5000);

    return () => {
      // Limpiar seguimiento al desmontar
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      clearTimeout(timer); // ✅ Limpiar el timer
    };
  }, []);

  // Búsqueda predictiva mientras escribe
  useEffect(() => {
    if (busqueda.length >= 3) {
      buscarSugerencias();
    } else {
      setSugerenciasBusqueda([]);
    }
  }, [busqueda]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Necesitamos tu ubicación para mostrar rutas',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          obtenerUbicacionActual();
        } else {
          Alert.alert('Permiso denegado', 'No se puede obtener tu ubicación');
          setCargando(false);
        }
      } catch (err) {
        console.warn(err);
        setCargando(false);
      }
    } else {
      obtenerUbicacionActual();
    }
  };

  const obtenerUbicacionActual = () => {
    console.log('Solicitando ubicación...');

    Geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Ubicación obtenida:', position);
        const { latitude, longitude } = position.coords;
        setUbicacionActual({ latitude, longitude });
        setCargando(false);

        // Mejora la precisión en segundo plano
        Geolocation.getCurrentPosition(
          (betterPosition) => {
            console.log('✅ Ubicación mejorada');
            const { latitude, longitude } = betterPosition.coords;
            setUbicacionActual({ latitude, longitude });
          },
          (err) => console.log('No se pudo mejorar precisión:', err.message),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      },
      (error) => {
        console.error('❌ Error de geolocalización:', error.code, error.message);
        Alert.alert(
          'Ubicación no disponible',
          'Usando ubicación por defecto (Quito)',
          [{ text: 'OK' }]
        );
        setUbicacionActual({ latitude: -0.180653, longitude: -78.467834 });
        setCargando(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  };

  // NUEVA FUNCIÓN: Seguimiento en tiempo real
  const iniciarSeguimientoRuta = () => {
    if (!destino) {
      Alert.alert('Sin destino', 'Primero selecciona un destino');
      return;
    }

    setSiguiendoRuta(true);

    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Ubicación actualizada:', latitude, longitude);

        setUbicacionActual({ latitude, longitude });

        // Centrar mapa en ubicación actual
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      },
      (error) => {
        console.error('Error en seguimiento:', error);
        Alert.alert('Error', 'No se pudo seguir tu ubicación');
        detenerSeguimientoRuta();
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Actualizar cada 10 metros
        interval: 5000, // Actualizar cada 5 segundos
        fastestInterval: 3000,
      }
    );

    setWatchId(id);
  };

  const detenerSeguimientoRuta = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setSiguiendoRuta(false);
  };

  // Búsqueda predictiva con Autocomplete
  const buscarSugerencias = async () => {
    if (busqueda.length < 3) return;

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        busqueda
      )}&components=country:ec&language=es&key=${GOOGLE_MAPS_APIKEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        setSugerenciasBusqueda(data.predictions.slice(0, 5));
      }
    } catch (error) {
      console.error('Error en sugerencias:', error);
    }
  };

  // Función mejorada: Búsqueda más precisa
  const buscarLugar = async (lugarSeleccionado = null) => {
    const terminoBusqueda = lugarSeleccionado || busqueda;

    if (!terminoBusqueda.trim()) {
      Alert.alert('Error', 'Por favor ingresa un lugar de destino');
      return;
    }

    setBuscandoRuta(true);
    Keyboard.dismiss();
    setMostrarSugerencias(false);
    setSugerenciasBusqueda([]);

    try {
      console.log('🔍 Buscando:', terminoBusqueda);

      // Si es un place_id (viene de autocomplete), úsalo directamente
      if (typeof terminoBusqueda === 'object' && terminoBusqueda.place_id) {
        const placeDetails = await obtenerDetallesLugar(terminoBusqueda.place_id);
        if (placeDetails) {
          establecerDestino(placeDetails);
          return;
        }
      }

      // Intenta con Geocoding primero
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        terminoBusqueda
      )}&components=country:EC&language=es&key=${GOOGLE_MAPS_APIKEY}`;

      let response = await fetch(geocodeUrl);
      let data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const resultado = data.results[0];
        const nuevoDestino = {
          latitude: resultado.geometry.location.lat,
          longitude: resultado.geometry.location.lng,
          nombre: resultado.formatted_address,
          direccion: resultado.formatted_address,
        };

        console.log('✅ Encontrado con Geocoding:', nuevoDestino.nombre);
        establecerDestino(nuevoDestino);
        return;
      }

      // Si Geocoding no funciona, intenta con Text Search
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        terminoBusqueda + ' Ecuador'
      )}&language=es&key=${GOOGLE_MAPS_APIKEY}`;

      response = await fetch(textSearchUrl);
      data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const place = data.results[0];
        const nuevoDestino = {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          nombre: place.name,
          direccion: place.formatted_address,
        };

        console.log('✅ Encontrado con Text Search:', nuevoDestino.nombre);
        establecerDestino(nuevoDestino);
        return;
      }

      Alert.alert(
        'No encontrado',
        `No se encontró "${terminoBusqueda}".\n\nIntenta con:\n• Nombre completo: "Chordeleg, Azuay"\n• Con referencia: "Iglesia de Chordeleg"\n• Ciudad completa: "Gualaceo, Ecuador"`
      );

    } catch (error) {
      console.error('Error en búsqueda:', error);
      Alert.alert('Error', 'Problema al buscar. Verifica tu conexión.');
    } finally {
      setBuscandoRuta(false);
    }
  };

  // Obtener detalles de un lugar por place_id
  const obtenerDetallesLugar = async (placeId) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=es&key=${GOOGLE_MAPS_APIKEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const place = data.result;
        return {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          nombre: place.name,
          direccion: place.formatted_address,
        };
      }
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
    return null;
  };

  // Establecer destino y ajustar mapa
  const establecerDestino = (nuevoDestino) => {
    setDestino(nuevoDestino);
    setBusqueda(nuevoDestino.nombre);

    // Ajustar el mapa
    if (mapRef.current && ubicacionActual) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(
          [ubicacionActual, nuevoDestino],
          {
            edgePadding: { top: 150, right: 80, bottom: 400, left: 80 },
            animated: true,
          }
        );
      }, 500);
    }
  };

  const limpiarRuta = () => {
    setDestino(null);
    setBusqueda('');
    setInfoRuta(null);
    setSugerenciasBusqueda([]);
    detenerSeguimientoRuta();
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsTraffic={false}
        showsBuildings={true}
        followsUserLocation={siguiendoRuta}
        initialRegion={
          ubicacionActual
            ? {
                latitude: ubicacionActual.latitude,
                longitude: ubicacionActual.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {ubicacionActual && (
          <Marker
            coordinate={ubicacionActual}
            title="Mi ubicación"
            description="Punto de partida"
            pinColor="green"
          />
        )}

        {destino && (
          <Marker
            coordinate={destino}
            title={destino.nombre}
            description={destino.direccion}
            pinColor="red"
          />
        )}

        {ubicacionActual && destino && (
          <MapViewDirections
            origin={ubicacionActual}
            destination={destino}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#4A90E2"
            mode={modoTransporte}
            language="es"
            optimizeWaypoints={true}
            precision="high"
            timePrecision="now"
            resetOnChange={false}
            onReady={(result) => {
              console.log('✅ Ruta calculada:', result.distance, 'km,', result.duration, 'min');
              setInfoRuta({
                distancia: result.distance.toFixed(1),
                duracion: Math.round(result.duration),
              });
            }}
            onError={(error) => {
              console.error('❌ Error en ruta:', error);
              Alert.alert(
                'Error de ruta',
                'No se pudo calcular la ruta. Intenta cambiar el modo de transporte.'
              );
            }}
          />
        )}
      </MapView>

      {/* ✅ Modal de Login */}
      <Modal
        visible={mostrarLogin}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarLogin(false)}
      >
        <Login onClose={() => setMostrarLogin(false)} />
      </Modal>

      {/* Panel de búsqueda mejorado */}
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="¿A dónde vamos? 🚀"
            placeholderTextColor="#999"
            value={busqueda}
            onChangeText={(text) => {
              setBusqueda(text);
              if (text.length >= 1) {
                setMostrarSugerencias(true);
              }
            }}
            onFocus={() => setMostrarSugerencias(true)}
            onSubmitEditing={() => buscarLugar()}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              style={styles.clearInputButton}
              onPress={() => {
                setBusqueda('');
                setSugerenciasBusqueda([]);
              }}
            >
              <Text style={styles.clearInputText}>✕</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => buscarLugar()}
            disabled={buscandoRuta}
          >
            {buscandoRuta ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Información de la ruta mejorada */}
        {infoRuta && (
          <View style={styles.infoRuta}>
            <View style={styles.infoRutaItem}>
              <Text style={styles.infoRutaIcon}>📍</Text>
              <View>
                <Text style={styles.infoRutaLabel}>Distancia</Text>
                <Text style={styles.infoRutaValue}>{infoRuta.distancia} km</Text>
              </View>
            </View>
            <View style={styles.infoRutaDivider} />
            <View style={styles.infoRutaItem}>
              <Text style={styles.infoRutaIcon}>⏱️</Text>
              <View>
                <Text style={styles.infoRutaLabel}>Tiempo</Text>
                <Text style={styles.infoRutaValue}>{infoRuta.duracion} min</Text>
              </View>
            </View>
          </View>
        )}

        {/* Sugerencias mejoradas */}
        {mostrarSugerencias && (sugerenciasBusqueda.length > 0 || busqueda.length < 3) && !destino && (
          <ScrollView
            style={styles.suggestionsContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {sugerenciasBusqueda.length > 0 ? (
              <>
                <Text style={styles.suggestionsTitle}>Sugerencias</Text>
                {sugerenciasBusqueda.map((sugerencia, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      buscarLugar({
                        place_id: sugerencia.place_id,
                        description: sugerencia.description,
                      });
                    }}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <Text style={styles.suggestionIcon}>📍</Text>
                    </View>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionMainText}>
                        {sugerencia.structured_formatting.main_text}
                      </Text>
                      <Text style={styles.suggestionSecondaryText}>
                        {sugerencia.structured_formatting.secondary_text}
                      </Text>
                    </View>
                    <Text style={styles.suggestionArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.suggestionsTitle}>Lugares Populares</Text>
                {lugaresPopulares.map((lugar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setBusqueda(lugar);
                      setMostrarSugerencias(false);
                      setTimeout(() => buscarLugar(lugar), 100);
                    }}
                  >
                    <View style={styles.suggestionIconContainer}>
                      <Text style={styles.suggestionIcon}>⭐</Text>
                    </View>
                    <Text style={styles.suggestionText}>{lugar}</Text>
                    <Text style={styles.suggestionArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        )}

        {/* Modos de transporte mejorados */}
        {!mostrarSugerencias && (
          <View style={styles.transportModes}>
            {[
              { mode: 'DRIVING', icon: '🚗', label: 'Auto' },
              { mode: 'WALKING', icon: '🚶', label: 'Caminar' },
              { mode: 'BICYCLING', icon: '🚴', label: 'Bici' },
              { mode: 'TRANSIT', icon: '🚌', label: 'Bus' },
            ].map((item) => (
              <TouchableOpacity
                key={item.mode}
                style={[
                  styles.modeButton,
                  modoTransporte === item.mode && styles.modeButtonActive,
                ]}
                onPress={() => {
                  setModoTransporte(item.mode);
                  setInfoRuta(null);
                }}
              >
                <Text style={styles.modeIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.modeLabel,
                    modoTransporte === item.mode && styles.modeLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Botones de acción mejorados */}
        {destino && !mostrarSugerencias && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.trackButton, siguiendoRuta && styles.trackButtonActive]}
              onPress={siguiendoRuta ? detenerSeguimientoRuta : iniciarSeguimientoRuta}
            >
              <Text style={styles.actionButtonIcon}>
                {siguiendoRuta ? '⏸' : '▶️'}
              </Text>
              <Text style={[styles.actionButtonText, siguiendoRuta && styles.trackButtonTextActive]}>
                {siguiendoRuta ? 'Detener' : 'Iniciar Ruta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={limpiarRuta}
            >
              <Text style={styles.actionButtonIcon}>✕</Text>
              <Text style={styles.actionButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!mostrarSugerencias && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setCargando(true);
              obtenerUbicacionActual();
            }}
          >
            <Text style={styles.refreshButtonIcon}>📍</Text>
            <Text style={styles.refreshButtonText}>Actualizar ubicación</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '75%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  clearInputButton: {
    position: 'absolute',
    right: 80,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 15,
  },
  clearInputText: {
    fontSize: 16,
    color: '#666',
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchButtonText: {
    fontSize: 24,
  },
  infoRuta: {
    marginTop: 15,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#E8F4F8',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoRutaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoRutaIcon: {
    fontSize: 24,
  },
  infoRutaLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  infoRutaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5F7F',
  },
  infoRutaDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ccc',
  },
  transportModes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  modeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modeIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  modeLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
  },
  modeLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    gap: 8,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  trackButtonActive: {
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
  },
  trackButtonTextActive: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5856D6',
    padding: 15,
    borderRadius: 15,
    gap: 8,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshButtonIcon: {
    fontSize: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    marginTop: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 12,
    maxHeight: 280,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 12,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionIcon: {
    fontSize: 20,
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '600',
    marginBottom: 3,
  },
  suggestionSecondaryText: {
    fontSize: 13,
    color: '#6c757d',
  },
  suggestionArrow: {
    fontSize: 24,
    color: '#adb5bd',
    marginLeft: 10,
  },
});