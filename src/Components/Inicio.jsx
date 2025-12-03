/**
 * Inicio.jsx
 * Splash Screen profesional y moderno
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Inicio() {
  const safeAreaInsets = useSafeAreaInsets();

  // Animaciones
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const titleSlide = useRef(new Animated.Value(50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const cityOpacity = useRef(new Animated.Value(0)).current;
  const citySlide = useRef(new Animated.Value(80)).current;

  const loadingProgress = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  const car1 = useRef(new Animated.Value(-100)).current;
  const car2 = useRef(new Animated.Value(-100)).current;

  // Partículas flotantes
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia principal de animaciones
    Animated.sequence([
      // Logo aparece con efecto dramático
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
      ]),
      // Título aparece
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
      ]),
      // Subtítulo aparece
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      // Ciudad aparece
      Animated.parallel([
        Animated.spring(citySlide, {
          toValue: 0,
          tension: 35,
          useNativeDriver: true
        }),
        Animated.timing(cityOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
      ]),
    ]).start();

    // Efecto de brillo continuo en el logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        }),
      ])
    ).start();

    // Animación de puntos suspensivos
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        }),
      ])
    ).start();

    // Barra de progreso
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false
    }).start();

    // Partículas flotantes
    const animateParticle = (anim, delay, duration) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -30,
              duration: duration,
              useNativeDriver: true
            }),
            Animated.timing(anim, {
              toValue: 30,
              duration: duration,
              useNativeDriver: true
            }),
          ])
        ).start();
      }, delay);
    };

    animateParticle(particle1Y, 0, 3000);
    animateParticle(particle2Y, 500, 3500);
    animateParticle(particle3Y, 1000, 4000);

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

    animateCar(car1, 2200, 4500);
    animateCar(car2, 3800, 4000);

  }, []);

  const progressWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Gradiente de fondo moderno */}
      <View style={styles.background}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientMiddle} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Partículas decorativas flotantes */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          {
            opacity: cityOpacity,
            transform: [{ translateY: particle1Y }]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          {
            opacity: cityOpacity,
            transform: [{ translateY: particle2Y }]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          {
            opacity: cityOpacity,
            transform: [{ translateY: particle3Y }]
          }
        ]}
      />

      {/* Sección superior: Logo y texto */}
      <View style={styles.topSection}>
        {/* Logo con efecto de brillo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { rotate: logoRotation }
              ]
            },
          ]}
        >
          {/* Anillo de brillo exterior */}
          <Animated.View
            style={[
              styles.glowRing,
              { opacity: glowOpacity }
            ]}
          />

          <Animated.Image
            source={require('../Imagenes/logo.png')}
            style={[
              {
                width: 150,
                height: 150,
                borderRadius: 75,
              },
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotation }
                ]
              }
            ]}
          />

        </Animated.View>

        {/* Título principal */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }]
          }}
        >
          <Text style={styles.title}>Ruta Segura</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Subtítulo con diseño mejorado */}
        <Animated.View style={{ opacity: subtitleOpacity, alignItems: 'center' }}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badge}>🌍 ECO-FRIENDLY</Text>
          </View>
          <Text style={styles.slogan}>Navega con Inteligencia</Text>
          <Text style={styles.subtitle}>Mapas · Rutas Ecológicas · Seguridad</Text>
        </Animated.View>
      </View>

      {/* Sección inferior: Ilustración de ciudad mejorada */}
      <Animated.View
        style={[
          styles.cityContainer,
          {
            opacity: cityOpacity,
            transform: [{ translateY: citySlide }]
          }
        ]}
      >
        {/* Fondo de ciudad con sombra */}
        <View style={styles.cityShadow} />

        {/* Cityscape - Edificios con diseño mejorado */}
        <View style={styles.cityscape}>
          {/* Edificios con diferentes alturas y estilos */}
          {[
            { height: 110, left: 15, color: '#42A5F5', windows: 4 },
            { height: 90, left: 70, color: '#1E88E5', windows: 3 },
            { height: 130, left: 125, color: '#1976D2', windows: 5, highlight: true },
            { height: 95, left: 180, color: '#1E88E5', windows: 3 },
            { height: 105, left: 235, color: '#42A5F5', windows: 4 },
            { height: 120, left: 290, color: '#1976D2', windows: 4 },
            { height: 85, left: 345, color: '#64B5F6', windows: 3 },
          ].map((building, index) => (
            <View
              key={index}
              style={[
                styles.building,
                {
                  height: building.height,
                  left: building.left,
                  backgroundColor: building.color,
                  borderTopLeftRadius: building.highlight ? 8 : 4,
                  borderTopRightRadius: building.highlight ? 8 : 4,
                }
              ]}
            >
              {/* Techo del edificio */}
              <View style={[
                styles.buildingTop,
                { backgroundColor: building.highlight ? '#0D47A1' : '#1565C0' }
              ]} />

              {/* Ventanas */}
              {Array.from({ length: building.windows }).map((_, row) => (
                <View
                  key={row}
                  style={[styles.windowRow, { top: 15 + row * 20 }]}
                >
                  <View style={styles.window} />
                  <View style={styles.window} />
                </View>
              ))}

              {/* Antena en edificio destacado */}
              {building.highlight && (
                <View style={styles.antenna}>
                  <View style={styles.antennaLight} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Árboles mejorados */}
        <View style={[styles.tree, { left: 40, bottom: 75 }]}>
          <View style={styles.treeTop}>
            <View style={styles.treeTopLayer1} />
            <View style={styles.treeTopLayer2} />
          </View>
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 40, bottom: 75 }]}>
          <View style={styles.treeTop}>
            <View style={styles.treeTopLayer1} />
            <View style={styles.treeTopLayer2} />
          </View>
          <View style={styles.treeTrunk} />
        </View>

        {/* Carretera mejorada */}
        <View style={styles.road}>
          {/* Líneas de la carretera */}
          {[15, 35, 55, 75].map((left, i) => (
            <View
              key={i}
              style={[
                styles.roadLine,
                { left: `${left}%` }
              ]}
            />
          ))}

          {/* Bordes de la carretera */}
          <View style={styles.roadEdgeTop} />
          <View style={styles.roadEdgeBottom} />
        </View>

        {/* Carros mejorados */}
        <Animated.View style={[styles.carWrapper, { transform: [{ translateX: car1 }] }]}>
          <View style={styles.carBlue}>
            <View style={styles.carShadow} />
            <View style={[styles.carTop, { backgroundColor: '#0D47A1' }]} />
            <View style={[styles.carBody, { backgroundColor: '#1565C0' }]} />
            <View style={styles.carWindowGlass} />
            <View style={[styles.carWheel, { left: 6 }]} />
            <View style={[styles.carWheel, { right: 6 }]} />
            <View style={styles.carLight} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.carWrapper, { transform: [{ translateX: car2 }] }]}>
          <View style={styles.carYellow}>
            <View style={styles.carShadow} />
            <View style={[styles.carTop, { backgroundColor: '#E65100' }]} />
            <View style={[styles.carBody, { backgroundColor: '#FF6F00' }]} />
            <View style={styles.carWindowGlass} />
            <View style={[styles.carWheel, { left: 6 }]} />
            <View style={[styles.carWheel, { right: 6 }]} />
            <View style={styles.carLight} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Barra de progreso moderna */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <View style={styles.progressGlow} />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>INICIANDO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D47A1',
    justifyContent: 'space-between',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: '#0D47A1',
  },
  gradientMiddle: {
    flex: 1,
    backgroundColor: '#1565C0',
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: '#1976D2',
  },

  // Partículas decorativas
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 50,
  },
  particle1: {
    width: 8,
    height: 8,
    top: 150,
    left: 50,
  },
  particle2: {
    width: 12,
    height: 12,
    top: 200,
    right: 80,
  },
  particle3: {
    width: 10,
    height: 10,
    top: 180,
    left: width - 100,
  },

  // Sección superior
  topSection: {
    alignItems: 'center',
    paddingTop: 100,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    top: -20,
    left: -20,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logoInnerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPin: {
    width: 65,
    height: 80,
    backgroundColor: '#1565C0',
    borderRadius: 32.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 32.5,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoPinInner: {
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: '#64B5F6',
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 8,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  slogan: {
    fontSize: 18,
    color: '#BBDEFB',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#90CAF9',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Ciudad
  cityContainer: {
    width: width,
    height: 220,
    position: 'relative',
    marginBottom: 20,
  },
  cityShadow: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
    height: 130,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ scaleY: 0.3 }],
  },
  cityscape: {
    position: 'absolute',
    bottom: 70,
    width: width,
    height: 130,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    width: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buildingTop: {
    width: '100%',
    height: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  windowRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 12,
  },
  window: {
    width: 11,
    height: 11,
    backgroundColor: '#FFF9C4',
    opacity: 0.9,
    borderRadius: 2,
    shadowColor: '#FFF9C4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  antenna: {
    position: 'absolute',
    top: -15,
    left: '50%',
    width: 2,
    height: 15,
    backgroundColor: '#FFFFFF',
    marginLeft: -1,
  },
  antennaLight: {
    position: 'absolute',
    top: 0,
    left: -2,
    width: 6,
    height: 6,
    backgroundColor: '#FF5252',
    borderRadius: 3,
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  // Árboles mejorados
  tree: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  treeTop: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeTopLayer1: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#66BB6A',
    borderRadius: 20,
  },
  treeTopLayer2: {
    position: 'absolute',
    width: 28,
    height: 28,
    backgroundColor: '#81C784',
    borderRadius: 14,
  },
  treeTrunk: {
    width: 8,
    height: 14,
    backgroundColor: '#5D4037',
    marginTop: -5,
    borderRadius: 2,
  },

  // Carretera mejorada
  road: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#37474F',
  },
  roadLine: {
    position: 'absolute',
    top: 33,
    width: 30,
    height: 4,
    backgroundColor: '#FDD835',
    borderRadius: 2,
  },
  roadEdgeTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#546E7A',
  },
  roadEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#263238',
  },

  // Carros mejorados
  carWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 10,
  },
  carBlue: {
    width: 70,
    height: 35,
    position: 'relative',
  },
  carYellow: {
    width: 70,
    height: 35,
    position: 'relative',
  },
  carShadow: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    width: 60,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    transform: [{ scaleY: 0.5 }],
  },
  carTop: {
    position: 'absolute',
    top: 0,
    left: 18,
    width: 32,
    height: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  carBody: {
    position: 'absolute',
    top: 12,
    left: 0,
    width: 70,
    height: 20,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  carWindowGlass: {
    position: 'absolute',
    top: 2,
    left: 20,
    width: 28,
    height: 11,
    backgroundColor: '#B3E5FC',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.8,
  },
  carWheel: {
    position: 'absolute',
    bottom: -3,
    width: 14,
    height: 14,
    backgroundColor: '#212121',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#424242',
  },
  carLight: {
    position: 'absolute',
    top: 18,
    right: 2,
    width: 6,
    height: 6,
    backgroundColor: '#FFEB3B',
    borderRadius: 3,
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  // Barra de progreso moderna
  progressContainer: {
    paddingHorizontal: 50,
    paddingBottom: 50,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#64B5F6',
    borderRadius: 2,
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingText: {
    fontSize: 12,
    color: '#90CAF9',
    fontWeight: '700',
    letterSpacing: 3,
  },
});