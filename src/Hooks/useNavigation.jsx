import { useState, useRef, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

// API KEY GOOGLE CLOUD
const GOOGLE_CLOUD_TTS_API_KEY = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";

export const useNavigation = (destino, mapRef) => {
  const [infoRuta, setInfoRuta] = useState(null);
  const [siguiendoRuta, setSiguiendoRuta] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [vozActivada, setVozActivada] = useState(true);
  const [pasos, setPasos] = useState([]);
  const [pasoActual, setPasoActual] = useState(0);
  const [distanciaAlProximoPaso, setDistanciaAlProximoPaso] = useState(null);
  const [mensajeVoz, setMensajeVoz] = useState("");

  const ultimaInstruccionAnunciada = useRef(null);
  const audioActual = useRef(null);
  const audioCache = useRef({});

  // ----------------------------
  // PERMISOS DE GEOLOCALIZACIÓN
  // ----------------------------
  const solicitarPermisos = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    Sound.setCategory("Playback", true);

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      if (audioActual.current) {
        audioActual.current.stop();
        audioActual.current.release();
      }
    };
  }, []);

  // ----------------------------
  // CALCULAR DISTANCIA (Haversine)
  // ----------------------------
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ----------------------------
  // GENERAR AUDIO GOOGLE TTS
  // ----------------------------
  const generarAudioGoogle = async (texto) => {
    try {
      // Verificar si ya está en caché
      if (audioCache.current[texto]) {
        console.log("✅ Audio encontrado en caché");
        return audioCache.current[texto];
      }

      console.log("🎤 Generando audio para:", texto);

      const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_TTS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: texto },
            voice: {
              languageCode: "es-ES",
              name: "es-ES-Standard-A",
              ssmlGender: "FEMALE",
            },
            audioConfig: { audioEncoding: "MP3" },
          }),
        }
      );

      const data = await res.json();
      if (!data.audioContent) {
        console.log("❌ No se recibió audio del servidor");
        return null;
      }

      // Guardar audio en archivo temporal
      const path = `${RNFS.CachesDirectoryPath}/tts_${Date.now()}.mp3`;
      await RNFS.writeFile(path, data.audioContent, "base64");

      // Guardar en caché
      audioCache.current[texto] = path;
      console.log("✅ Audio guardado en:", path);

      return path;

    } catch (e) {
      console.log("❌ Error generando audio:", e);
      return null;
    }
  };

  // ----------------------------
  // REPRODUCIR AUDIO
  // ----------------------------
  const reproducirAudio = async (filePath) => {
    return new Promise((resolve) => {
      if (!filePath) {
        console.log("⚠️ No hay archivo de audio para reproducir");
        return resolve();
      }

      // Detener audio anterior si existe
      if (audioActual.current) {
        audioActual.current.stop();
        audioActual.current.release();
      }

      console.log("🔊 Reproduciendo audio:", filePath);

      const sound = new Sound(filePath, "", (error) => {
        if (error) {
          console.log("❌ Error cargando audio:", error);
          return resolve();
        }

        audioActual.current = sound;
        sound.play((success) => {
          if (success) {
            console.log("✅ Audio reproducido exitosamente");
          } else {
            console.log("❌ Error en reproducción");
          }
          sound.release();
          resolve();
        });
      });
    });
  };

  // ----------------------------
  // ANUNCIAR INSTRUCCIÓN
  // ----------------------------
  const anunciarInstruccion = async (texto) => {
    if (!vozActivada || !texto) {
      console.log("⚠️ Voz desactivada o texto vacío");
      return;
    }

    // Evitar repetir la misma instrucción
    if (ultimaInstruccionAnunciada.current === texto) {
      console.log("⚠️ Instrucción ya anunciada, omitiendo");
      return;
    }

    console.log("📢 Anunciando:", texto);
    ultimaInstruccionAnunciada.current = texto;
    setMensajeVoz(texto);

    const filePath = await generarAudioGoogle(texto);
    await reproducirAudio(filePath);

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setMensajeVoz(""), 5000);
  };

  // ----------------------------
  // FORMATEAR INSTRUCCIÓN (limpiar HTML y mejorar pronunciación)
  // ----------------------------
  const formatearInstruccion = (html) => {
    return html
      .replace(/<[^>]*>/g, "") // Eliminar etiquetas HTML
      .replace(/&nbsp;/g, " ") // Espacios
      .replace(/&amp;/g, "y")
      .replace(/\bkm\b/g, "kilómetros")
      .replace(/\bm\b(?!\w)/g, "metros") // Evitar reemplazar "m" en palabras
      .replace(/\bcalle\b/gi, "calle")
      .replace(/\bavenida\b/gi, "avenida")
      .replace(/\bav\.\b/gi, "avenida")
      .trim();
  };

  // ----------------------------
  // INICIAR RUTA
  // ----------------------------
  const iniciarSeguimientoRuta = async () => {
    const permiso = await solicitarPermisos();
    if (!permiso) {
      Alert.alert("Error", "Permiso de ubicación denegado");
      return;
    }

    if (!destino) {
      Alert.alert("Error", "Selecciona un destino primero");
      return;
    }

    if (pasos.length === 0) {
      Alert.alert("Error", "No hay pasos de navegación disponibles");
      return;
    }

    console.log("🚀 Iniciando navegación con", pasos.length, "pasos");

    // Anunciar inicio de navegación
    await anunciarInstruccion("Iniciando navegación");

    // Anunciar la primera instrucción
    if (pasos.length > 0 && pasos[0]) {
      const primeraInstruccion = formatearInstruccion(pasos[0].html_instructions);
      setTimeout(() => {
        anunciarInstruccion(primeraInstruccion);
      }, 2000); // Esperar 2 segundos después de "Iniciando navegación"
    }

    setSiguiendoRuta(true);

    const id = Geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Ubicación actualizada:", latitude, longitude);

        if (pasos.length > 0 && pasoActual < pasos.length) {
          const paso = pasos[pasoActual];
          const distance = calcularDistancia(
            latitude,
            longitude,
            paso.end_location.lat,
            paso.end_location.lng
          );

          const distanciaRedondeada = Math.round(distance);
          setDistanciaAlProximoPaso(distanciaRedondeada);

          console.log(`📏 Distancia al paso ${pasoActual + 1}: ${distanciaRedondeada}m`);

          // Anunciar cuando falten 100 metros
          if (distance < 100 && distance > 50) {
            const instruccionFormateada = formatearInstruccion(paso.html_instructions);
            anunciarInstruccion(`En 100 metros, ${instruccionFormateada}`);
          }

          // Avanzar al siguiente paso cuando esté cerca
          if (distance < 20) {
            console.log("✅ Paso completado, avanzando al siguiente");

            setPasoActual((prev) => {
              const nuevo = prev + 1;

              if (nuevo < pasos.length) {
                const siguientePaso = pasos[nuevo];
                const instruccionFormateada = formatearInstruccion(siguientePaso.html_instructions);
                anunciarInstruccion(instruccionFormateada);
              } else {
                anunciarInstruccion("Has llegado a tu destino");
                detenerSeguimientoRuta();
              }

              return nuevo;
            });
          }
        }

        // Centrar mapa en ubicación actual
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            500
          );
        }
      },
      (err) => {
        console.log("❌ ERROR watchPosition:", err);
        Alert.alert("Error", "No se pudo obtener la ubicación");
        detenerSeguimientoRuta();
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Actualizar cada 5 metros
        interval: 2000, // Cada 2 segundos
        fastestInterval: 1000,
      }
    );

    setWatchId(id);
  };

  // ----------------------------
  // DETENER RUTA
  // ----------------------------
  const detenerSeguimientoRuta = () => {
    console.log("⏹️ Deteniendo navegación");

    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (audioActual.current) {
      audioActual.current.stop();
      audioActual.current.release();
      audioActual.current = null;
    }

    setSiguiendoRuta(false);
    setMensajeVoz("");
    ultimaInstruccionAnunciada.current = null;
  };

  // ----------------------------
  // LIMPIAR NAVEGACIÓN (NUEVA FUNCIÓN)
  // ----------------------------
  const limpiarNavegacion = () => {
    console.log("🧹 Limpiando datos de navegación");

    detenerSeguimientoRuta();
    setInfoRuta(null);
    setPasos([]);
    setPasoActual(0);
    setDistanciaAlProximoPaso(null);
    ultimaInstruccionAnunciada.current = null;
  };

  // ----------------------------
  // CARGA DE RUTA
  // ----------------------------
  const onRutaCalculada = (result) => {
    console.log("🗺️ Ruta calculada:", result);

    setInfoRuta({
      distancia: result.distance.toFixed(1),
      duracion: Math.round(result.duration),
    });

    if (result.legs && result.legs[0]?.steps) {
      const pasosRuta = result.legs[0].steps;
      console.log("📋 Pasos de navegación:", pasosRuta.length);
      setPasos(pasosRuta);
      setPasoActual(0);
      setDistanciaAlProximoPaso(null);
      ultimaInstruccionAnunciada.current = null;
    }
  };

  return {
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
    limpiarNavegacion, // ✅ AGREGADA
    onRutaCalculada,
  };
};