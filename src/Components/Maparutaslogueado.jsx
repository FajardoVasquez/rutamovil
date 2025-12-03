import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import Login from './Login';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../Styles/MapaRutas.js';

import { useLocation } from '../Hooks/useLocation';
import { usePlacesSearch } from '../Hooks/usePlacesSearch';
import { useNavigation } from '../Hooks/useNavigation';
import { useUIState } from '../Hooks/useUIState';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAV96rDqSM8Icz5o3H-a6mcfrWLfWjwvUc';

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

const modosTransporte = [
  { mode: 'DRIVING', icon: '🚗', label: 'Auto' },
  { mode: 'WALKING', icon: '🚶', label: 'Caminar' },
];

export default function Maparutaslogueado() {
  const mapRef = useRef(null);

  const {
    ubicacionActual,
    setUbicacionActual,
    cargando,
    setCargando,
    obtenerUbicacionActual,
  } = useLocation();

  const {
    destino,
    busqueda,
    setBusqueda,
    buscandoRuta,
    mostrarSugerencias,
    setMostrarSugerencias,
    sugerenciasBusqueda,
    buscarLugar,
    limpiarBusqueda,
  } = usePlacesSearch(mapRef, ubicacionActual);

  const {
    infoRuta,
    siguiendoRuta,
    vozActivada,
    setVozActivada,
    pasos,
    pasoActual,
    distanciaAlProximoPaso,
    mensajeVoz,
    iniciarSeguimientoRuta,
    detenerSeguimientoRuta,
    onRutaCalculada,
    limpiarNavegacion,
  } = useNavigation(destino, mapRef);

  const {
    modoTransporte,
    cambiarModoTransporte,
    mostrarMenuTransporte,
    setMostrarMenuTransporte,
    panelBusquedaVisible,
    setPanelBusquedaVisible,
    fadeAnim,
  } = useUIState();

  const limpiarRuta = () => {
    limpiarBusqueda();
    limpiarNavegacion();
  };

  const handleCambioModoTransporte = (nuevoModo) => {
    cambiarModoTransporte(nuevoModo);
    limpiarNavegacion();
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación precisa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false}
        showsMyLocationButton={false}
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
        {/* ✅ MARCADOR PERSONALIZADO DE TU UBICACIÓN (PUNTO DE PARTIDA) */}
        {ubicacionActual && (
          <Marker
            coordinate={ubicacionActual}
            title="Mi ubicación"
            description="Punto de partida"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerPulse} />
              <View style={styles.markerDot} />
            </View>
          </Marker>
        )}

        {/* ✅ MARCADOR DEL DESTINO */}
        {destino && (
          <Marker
            coordinate={destino}
            title={destino.nombre}
            description={destino.direccion}
          >
            <View style={styles.destinationMarker}>
              <Text style={styles.destinationPin}>📍</Text>
            </View>
          </Marker>
        )}

        {/* ✅ RUTA */}
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
            onReady={onRutaCalculada}
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

      {/* Botón toggle búsqueda */}
      <TouchableOpacity
        style={styles.toggleSearchButton}
        onPress={() => setPanelBusquedaVisible(!panelBusquedaVisible)}
      >
        <Text style={styles.toggleSearchIcon}>
          {panelBusquedaVisible ? '✕' : '🔍'}
        </Text>
      </TouchableOpacity>

      {/* Botón control de voz */}
      {siguiendoRuta && (
        <TouchableOpacity
          style={styles.vozButton}
          onPress={() => {
            const nuevoEstado = !vozActivada;
            setVozActivada(nuevoEstado);
            Alert.alert(nuevoEstado ? '🔊' : '🔇', nuevoEstado ? 'Guía de voz activada' : 'Guía de voz desactivada');
          }}
        >
          <Text style={styles.vozButtonIcon}>{vozActivada ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>
      )}

      {/* Instrucción actual */}
      {siguiendoRuta && pasos.length > 0 && pasoActual < pasos.length && (
        <View style={styles.instruccionActual}>
          <Text style={styles.instruccionTexto}>
            {pasos[pasoActual].html_instructions.replace(/<[^>]*>/g, '')}
          </Text>
          {distanciaAlProximoPaso !== null && (
            <Text style={styles.instruccionDistancia}>
              En {distanciaAlProximoPaso}m
            </Text>
          )}
        </View>
      )}


      {/* Panel de búsqueda */}
      {panelBusquedaVisible && (
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

          {/* Info ruta */}
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

          {/* Sugerencias */}
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

          {/* Menú transporte */}
          {!mostrarSugerencias && (
            <TouchableOpacity
              style={styles.transportMenuButton}
              onPress={() => setMostrarMenuTransporte(!mostrarMenuTransporte)}
            >
              <Text style={styles.transportMenuIcon}>
                {modosTransporte.find((m) => m.mode === modoTransporte)?.icon}
              </Text>
              <Text style={styles.transportMenuText}>
                {modosTransporte.find((m) => m.mode === modoTransporte)?.label}
              </Text>
              <Text style={styles.transportMenuArrow}>
                {mostrarMenuTransporte ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Opciones transporte */}
          {mostrarMenuTransporte && !mostrarSugerencias && (
            <View style={styles.transportOptions}>
              {modosTransporte.map((item) => (
                <TouchableOpacity
                  key={item.mode}
                  style={[
                    styles.transportOption,
                    modoTransporte === item.mode && styles.transportOptionActive,
                  ]}
                  onPress={() => handleCambioModoTransporte(item.mode)}
                >
                  <Text style={styles.transportOptionIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.transportOptionText,
                      modoTransporte === item.mode && styles.transportOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {modoTransporte === item.mode && (
                    <Text style={styles.transportOptionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Botones acción */}
          {destino && !mostrarSugerencias && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.trackButton,
                  siguiendoRuta && styles.trackButtonActive,
                ]}
                onPress={siguiendoRuta ? detenerSeguimientoRuta : () => iniciarSeguimientoRuta(ubicacionActual)}
              >
                <Text style={styles.actionButtonIcon}>
                  {siguiendoRuta ? '⏸' : '▶️'}
                </Text>
                <Text
                  style={[
                    styles.actionButtonText,
                    siguiendoRuta && styles.trackButtonTextActive,
                  ]}
                >
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
      )}
    </View>
  );
}