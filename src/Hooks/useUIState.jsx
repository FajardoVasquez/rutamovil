import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useUIState = () => {
  const [modoTransporte, setModoTransporte] = useState('DRIVING');
  const [menuExpandido, setMenuExpandido] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarMenuTransporte, setMostrarMenuTransporte] = useState(false);
  const [panelBusquedaVisible, setPanelBusquedaVisible] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setMostrarLogin(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const cambiarModoTransporte = (nuevoModo) => {
    setModoTransporte(nuevoModo);
    setMostrarMenuTransporte(false);
  };

  return {
    modoTransporte,
    setModoTransporte,
    cambiarModoTransporte,
    menuExpandido,
    setMenuExpandido,
    mostrarLogin,
    setMostrarLogin,
    mostrarMenuTransporte,
    setMostrarMenuTransporte,
    panelBusquedaVisible,
    setPanelBusquedaVisible,
    fadeAnim,
  };
};