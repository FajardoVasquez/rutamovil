import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Inicio from './src/Components/Inicio';
import Main from './src/Components/Main';

export default function App() {
  const [showInicio, setShowInicio] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowInicio(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      {showInicio ? <Inicio /> : <Main />}
    </SafeAreaProvider>
  );
}
