import { useState, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const watchIdRef = useRef(null);
  const ultimaPosicionRef = useRef(null);
  const muestrasRef = useRef([]);

  // 🔒 PARÁMETROS ANTI-DERIVA (MUY ESTRICTOS)
  const PRECISION_MINIMA = 40;           // Acepta GPS de hasta 40m de error
  const DISTANCIA_MINIMA_ACTUALIZAR = 15; // NO actualizar si se movió menos de 15m
  const TIEMPO_SUAVIZADO = 7;            // Promedia 7 lecturas (más suave)
  const UMBRAL_ESTATICO = 3;             // Si 3 lecturas seguidas son < 15m, está quieto

  const contadorEstatico = useRef(0);    // Cuenta cuántas veces seguidas no se movió
  const posicionBloqueada = useRef(null); // Posición "congelada" cuando está quieto

  useEffect(() => {
    requestLocationPermission();

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

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

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const suavizarPosicion = (nuevaPosicion) => {
    muestrasRef.current.push(nuevaPosicion);

    if (muestrasRef.current.length > TIEMPO_SUAVIZADO) {
      muestrasRef.current.shift();
    }

    const suma = muestrasRef.current.reduce(
      (acc, pos) => ({
        latitude: acc.latitude + pos.latitude,
        longitude: acc.longitude + pos.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: suma.latitude / muestrasRef.current.length,
      longitude: suma.longitude / muestrasRef.current.length,
    };
  };

  const procesarNuevaPosicion = (position) => {
    const { latitude, longitude, accuracy } = position.coords;

    // 🔍 Filtro 1: Rechazar si la precisión es muy baja
    if (accuracy > PRECISION_MINIMA) {
      console.log(`⚠️ Precisión baja ignorada: ${accuracy.toFixed(1)}m`);
      return;
    }

    // 🔒 Si hay una posición bloqueada (estás quieto), úsala
    if (posicionBloqueada.current) {
      const distanciaDesdeBloqueo = calcularDistancia(
        posicionBloqueada.current.latitude,
        posicionBloqueada.current.longitude,
        latitude,
        longitude
      );

      // Solo desbloquear si te moviste más de 15m
      if (distanciaDesdeBloqueo < DISTANCIA_MINIMA_ACTUALIZAR) {
        console.log(`🔒 POSICIÓN BLOQUEADA - Movimiento ignorado: ${distanciaDesdeBloqueo.toFixed(2)}m`);
        return; // NO actualizar, mantener la posición bloqueada
      } else {
        console.log(`🔓 POSICIÓN DESBLOQUEADA - Movimiento real: ${distanciaDesdeBloqueo.toFixed(2)}m`);
        posicionBloqueada.current = null;
        contadorEstatico.current = 0;
        muestrasRef.current = []; // Resetear muestras
      }
    }

    // 🔍 Filtro 2: Detectar si está estático
    if (ultimaPosicionRef.current) {
      const distancia = calcularDistancia(
        ultimaPosicionRef.current.latitude,
        ultimaPosicionRef.current.longitude,
        latitude,
        longitude
      );

      // Si el movimiento es pequeño
      if (distancia < DISTANCIA_MINIMA_ACTUALIZAR) {
        contadorEstatico.current++;
        console.log(`⏸️ Movimiento pequeño (${distancia.toFixed(2)}m) - Contador: ${contadorEstatico.current}/${UMBRAL_ESTATICO}`);

        // Si ya hubo 3 movimientos pequeños seguidos, BLOQUEAR la posición
        if (contadorEstatico.current >= UMBRAL_ESTATICO) {
          if (!posicionBloqueada.current) {
            posicionBloqueada.current = ultimaPosicionRef.current;
            console.log(`🔒 POSICIÓN BLOQUEADA en: ${posicionBloqueada.current.latitude.toFixed(6)}, ${posicionBloqueada.current.longitude.toFixed(6)}`);
          }
          return; // NO actualizar más
        }
        return; // NO actualizar
      } else {
        // Movimiento significativo detectado
        console.log(`✅ Movimiento real: ${distancia.toFixed(2)}m`);
        contadorEstatico.current = 0; // Resetear contador
      }
    }

    // ✅ Suavizar la posición
    const posicionSuavizada = suavizarPosicion({ latitude, longitude });

    // Actualizar referencias
    ultimaPosicionRef.current = posicionSuavizada;

    // Actualizar estado SOLO si no hay posición bloqueada
    if (!posicionBloqueada.current) {
      setUbicacionActual(posicionSuavizada);
      console.log(
        `📍 Posición actualizada: ${posicionSuavizada.latitude.toFixed(6)}, ${posicionSuavizada.longitude.toFixed(6)}`
      );
    }
  };

  const obtenerUbicacionActual = () => {
    console.log('🔍 Iniciando seguimiento de ubicación...');

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const posicionInicial = { latitude, longitude };
        setUbicacionActual(posicionInicial);
        ultimaPosicionRef.current = posicionInicial;
        muestrasRef.current = [posicionInicial];
        setCargando(false);
        console.log('✅ Ubicación inicial obtenida');
      },
      (error) => {
        console.error('❌ Error inicial:', error.message);
        Alert.alert(
          'Ubicación no disponible',
          'Usando ubicación por defecto (Cuenca, Ecuador)'
        );
        const defaultLocation = { latitude: -2.9001, longitude: -79.0059 };
        setUbicacionActual(defaultLocation);
        ultimaPosicionRef.current = defaultLocation;
        muestrasRef.current = [defaultLocation];
        setCargando(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      }
    );

    watchIdRef.current = Geolocation.watchPosition(
      procesarNuevaPosicion,
      (error) => {
        console.error('❌ Error en watchPosition:', error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Configuración nativa también más estricta
        interval: 3000,
        fastestInterval: 2000,
      }
    );
  };

  const detenerSeguimiento = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      posicionBloqueada.current = null;
      contadorEstatico.current = 0;
      console.log('🛑 Seguimiento de ubicación detenido');
    }
  };

  return {
    ubicacionActual,
    setUbicacionActual,
    cargando,
    setCargando,
    obtenerUbicacionActual,
    detenerSeguimiento,
  };
};
