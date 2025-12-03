import { useState, useEffect } from 'react';
import { Alert, Keyboard } from 'react-native';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAV96rDqSM8Icz5o3H-a6mcfrWLfWjwvUc';

export const usePlacesSearch = (mapRef, ubicacionActual) => {
  const [destino, setDestino] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [buscandoRuta, setBuscandoRuta] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState([]);

  useEffect(() => {
    if (busqueda.length >= 3) {
      buscarSugerencias();
    } else {
      setSugerenciasBusqueda([]);
    }
  }, [busqueda]);

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

  const establecerDestino = (nuevoDestino) => {
    setDestino(nuevoDestino);
    setBusqueda(nuevoDestino.nombre);

    if (mapRef.current && ubicacionActual) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates([ubicacionActual, nuevoDestino], {
          edgePadding: { top: 150, right: 80, bottom: 400, left: 80 },
          animated: true,
        });
      }, 500);
    }
  };

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

      // Si es un objeto con place_id
      if (typeof terminoBusqueda === 'object' && terminoBusqueda.place_id) {
        const placeDetails = await obtenerDetallesLugar(terminoBusqueda.place_id);
        if (placeDetails) {
          establecerDestino(placeDetails);
          return;
        }
      }

      // Geocoding API
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

      // Text Search API
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

  const limpiarBusqueda = () => {
    setDestino(null);
    setBusqueda('');
    setSugerenciasBusqueda([]);
  };

  return {
    destino,
    busqueda,
    setBusqueda,
    buscandoRuta,
    mostrarSugerencias,
    setMostrarSugerencias,
    sugerenciasBusqueda,
    buscarLugar,
    limpiarBusqueda,
  };
};