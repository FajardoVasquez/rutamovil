/**
 * Inicio.jsx
 * Splash Screen profesional - Se muestra durante 5 segundos
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Inicio() {
  const safeAreaInsets = useSafeAreaInsets();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const cityOpacity = useRef(new Animated.Value(0)).current;
  const citySlide = useRef(new Animated.Value(50)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  const car1 = useRef(new Animated.Value(-100)).current;
  const car2 = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Secuencia de animaciones profesional
    Animated.sequence([
      // 1. Logo aparece (0-0.8s)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
      ]),
      // 2. Título aparece (0.8-1.2s)
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
      ]),
      // 3. Subtítulo aparece (1.2-1.6s)
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      // 4. Ciudad aparece (1.6-2.2s)
      Animated.parallel([
        Animated.spring(citySlide, {
          toValue: 0,
          tension: 30,
          useNativeDriver: true
        }),
        Animated.timing(cityOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
      ]),
    ]).start();

    // Pulso continuo del logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
      ])
    ).start();

    // Barra de progreso (0-5s)
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false
    }).start();

    // Animación de carros
    const animateCar = (anim, delay, duration) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: width + 100,
              duration: duration,
              useNativeDriver: true
            }),
            Animated.timing(anim, {
              toValue: -100,
              duration: 0,
              useNativeDriver: true
            }),
          ])
        ).start();
      }, delay);
    };

    animateCar(car1, 2000, 4500);
    animateCar(car2, 3500, 4000);

  }, []);

  const progressWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente sutil */}
      <View style={styles.background}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Decoración: Nubes sutiles */}
      <Animated.View style={[styles.cloud, styles.cloud1, { opacity: cityOpacity }]} />
      <Animated.View style={[styles.cloud, styles.cloud2, { opacity: cityOpacity }]} />
      <Animated.View style={[styles.cloud, styles.cloud3, { opacity: cityOpacity }]} />

      {/* Sección superior: Logo y texto */}
      <View style={styles.topSection}>
        {/* Logo con animación */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }]
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <View style={styles.logoPin}>
              <View style={styles.logoPinInner} />
            </View>
          </View>
        </Animated.View>

        {/* Título principal */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }]
          }}
        >
          <Text style={styles.title}>Ruta Segura</Text>
        </Animated.View>

        {/* Subtítulo y descripción */}
        <Animated.View style={{ opacity: subtitleOpacity, alignItems: 'center' }}>
          <Text style={styles.slogan}>Navega, descubre y protege 🌍</Text>
          <Text style={styles.subtitle}>Mapas inteligentes y rutas ecológicas</Text>
          <Text style={styles.tagline}>Tu compañero de viaje seguro</Text>
        </Animated.View>
      </View>

      {/* Sección inferior: Ilustración de ciudad */}
      <Animated.View
        style={[
          styles.cityContainer,
          {
            opacity: cityOpacity,
            transform: [{ translateY: citySlide }]
          }
        ]}
      >
        {/* Cityscape - Edificios */}
        <View style={styles.cityscape}>
          {/* Edificio 1 */}
          <View style={[styles.building, styles.building1, { height: 100, left: 20 }]}>
            <View style={styles.buildingTop} />
            <View style={[styles.windowStripe, { top: 12 }]} />
            <View style={[styles.windowStripe, { top: 26 }]} />
            <View style={[styles.windowStripe, { top: 40 }]} />
          </View>

          {/* Edificio 2 */}
          <View style={[styles.building, styles.building2, { height: 85, left: 75 }]}>
            <View style={styles.buildingTop} />
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.windowRow, { top: 12 + row * 18 }]}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            ))}
          </View>

          {/* Edificio 3 - Principal (más alto) */}
          <View style={[styles.building, styles.building3, { height: 120, left: 130 }]}>
            <View style={[styles.buildingTop, { backgroundColor: '#1565C0' }]} />
            {[0, 1, 2, 3].map((row) => (
              <View key={row} style={[styles.windowRow, { top: 15 + row * 20 }]}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            ))}
          </View>

          {/* Edificio 4 */}
          <View style={[styles.building, styles.building2, { height: 90, left: 190 }]}>
            <View style={styles.buildingTop} />
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.windowRow, { top: 12 + row * 18 }]}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            ))}
          </View>

          {/* Edificio 5 */}
          <View style={[styles.building, styles.building1, { height: 95, left: 245 }]}>
            <View style={styles.buildingTop} />
            <View style={[styles.windowStripe, { top: 12 }]} />
            <View style={[styles.windowStripe, { top: 26 }]} />
            <View style={[styles.windowStripe, { top: 40 }]} />
          </View>

          {/* Edificio 6 */}
          <View style={[styles.building, styles.building3, { height: 110, left: 300 }]}>
            <View style={[styles.buildingTop, { backgroundColor: '#1565C0' }]} />
            {[0, 1, 2, 3].map((row) => (
              <View key={row} style={[styles.windowRow, { top: 12 + row * 18 }]}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            ))}
          </View>

          {/* Edificio 7 */}
          <View style={[styles.building, styles.building2, { height: 80, left: 360 }]}>
            <View style={styles.buildingTop} />
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.windowRow, { top: 12 + row * 16 }]}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            ))}
          </View>
        </View>

        {/* Árboles decorativos */}
        <View style={[styles.tree, { left: 35, bottom: 75 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 35, bottom: 75 }]}>
          <View style={styles.treeTop} />
          <View style={styles.treeTrunk} />
        </View>

        {/* Carretera */}
        <View style={styles.road}>
          <View style={[styles.roadLine, { left: '15%' }]} />
          <View style={[styles.roadLine, { left: '45%' }]} />
          <View style={[styles.roadLine, { left: '75%' }]} />
        </View>

        {/* Carros animados */}
        <Animated.View style={[styles.carWrapper, { transform: [{ translateX: car1 }] }]}>
          <View style={styles.carBlue}>
            <View style={[styles.carTop, { backgroundColor: '#1565C0' }]} />
            <View style={[styles.carBody, { backgroundColor: '#1E88E5' }]} />
            <View style={styles.carWindowGlass} />
            <View style={[styles.carWheel, { left: 8 }]} />
            <View style={[styles.carWheel, { right: 8 }]} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.carWrapper, { transform: [{ translateX: car2 }] }]}>
          <View style={styles.carYellow}>
            <View style={[styles.carTop, { backgroundColor: '#F57C00' }]} />
            <View style={[styles.carBody, { backgroundColor: '#FFA726' }]} />
            <View style={styles.carWindowGlass} />
            <View style={[styles.carWheel, { left: 8 }]} />
            <View style={[styles.carWheel, { right: 8 }]} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Barra de progreso minimalista */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'space-between',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: '#BBDEFB',
  },

  // Nubes decorativas
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 50,
  },
  cloud1: {
    width: 100,
    height: 40,
    top: 80,
    left: 30,
  },
  cloud2: {
    width: 80,
    height: 35,
    top: 120,
    right: 50,
  },
  cloud3: {
    width: 90,
    height: 38,
    top: 100,
    left: width - 120,
  },

  // Sección superior
  topSection: {
    alignItems: 'center',
    paddingTop: 80,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 25,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#1E88E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  logoPin: {
    width: 60,
    height: 75,
    backgroundColor: '#1E88E5',
    borderRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 30,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPinInner: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
  title: {
    fontSize: 42,
    color: '#1565C0',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  slogan: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 12,
    color: '#78909C',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Ciudad
  cityContainer: {
    width: width,
    height: 200,
    position: 'relative',
    marginBottom: 30,
  },
  cityscape: {
    position: 'absolute',
    bottom: 70,
    width: width,
    height: 120,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  building1: {
    backgroundColor: '#64B5F6',
  },
  building2: {
    backgroundColor: '#42A5F5',
  },
  building3: {
    backgroundColor: '#2196F3',
  },
  buildingTop: {
    width: '100%',
    height: 4,
    backgroundColor: '#1976D2',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  windowStripe: {
    position: 'absolute',
    width: '75%',
    height: 6,
    backgroundColor: '#1565C0',
    left: '12.5%',
    opacity: 0.7,
  },
  windowRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  window: {
    width: 10,
    height: 10,
    backgroundColor: '#1565C0',
    opacity: 0.7,
  },

  // Árboles
  tree: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  treeTop: {
    width: 35,
    height: 35,
    backgroundColor: '#66BB6A',
    borderRadius: 17.5,
  },
  treeTrunk: {
    width: 7,
    height: 12,
    backgroundColor: '#5D4037',
    marginTop: -4,
  },

  // Carretera
  road: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#546E7A',
  },
  roadLine: {
    position: 'absolute',
    top: 32,
    width: 35,
    height: 3,
    backgroundColor: '#ECEFF1',
  },

  // Carros
  carWrapper: {
    position: 'absolute',
    bottom: 28,
    zIndex: 10,
  },
  carBlue: {
    width: 65,
    height: 32,
    position: 'relative',
  },
  carYellow: {
    width: 65,
    height: 32,
    position: 'relative',
  },
  carTop: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 30,
    height: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  carBody: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 65,
    height: 18,
    borderRadius: 5,
  },
  carWindowGlass: {
    position: 'absolute',
    top: 2,
    left: 18,
    width: 26,
    height: 9,
    backgroundColor: '#B3E5FC',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  carWheel: {
    position: 'absolute',
    bottom: -2,
    width: 12,
    height: 12,
    backgroundColor: '#263238',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#37474F',
  },

  // Barra de progreso
  progressContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 1.5,
  },
  loadingText: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '500',
    letterSpacing: 1,
  },
});