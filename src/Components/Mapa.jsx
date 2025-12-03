import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';

export default function Mapa() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Hero con imagen de ciudad */}
      <View style={styles.heroSection}>
        {/* Imagen de fondo */}
        <Image
          source={require('../Imagenes/img.png')}
          style={styles.heroImage}
        />

        {/* Overlay oscuro */}
        <View style={styles.heroOverlay} />

        {/* Contenido del hero */}
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Tu Guía de Rutas Urbanas</Text>
          <Text style={styles.heroSubtitle}>Navegación Inteligente en Tiempo Real</Text>
          <Text style={styles.heroSubtitle}>
            Optimiza tu trayecto con rutas precisas, alertas oportunas y orientación confiable diseñada para tu bienestar.
          </Text>




        </View>
      </View>

      {/* Sección blanca con estadísticas */}
      <View style={styles.statsWhiteSection}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsHeaderTitle}>Estadísticas de Rutas</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statEmoji}>🗺️</Text>
            </View>
            <Text style={styles.statTitle}>48 Rutas Activas</Text>
            <Text style={styles.statSubtitle}>Flujo vehicular óptimo</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statEmoji}>🌐</Text>
            </View>
            <Text style={styles.statTitle}>Monitorio 24/7</Text>
            <Text style={styles.statSubtitle}>Sin interrupciones</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Text style={styles.statEmoji}>🛡️</Text>
            </View>
            <Text style={styles.statTitle}>1.5M+ Usiirar</Text>
            <Text style={styles.statSubtitle}>Tu compañero de viaje</Text>
          </View>
        </View>
      </View>

      {/* Características Principales */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Características Principales</Text>
          <View style={styles.sectionUnderline} />
        </View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>📍</Text>
            </View>
            <Text style={styles.featureTitle}>Ubicación Precisa</Text>
            <Text style={styles.featureDesc}>
              Geolocalización estable y en tiempo real incluso en zonas de baja señal.
            </Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>🧭</Text>
            </View>
            <Text style={styles.featureTitle}>GPS Integrado</Text>
            <Text style={styles.featureDesc}>
              Navegación inteligente con actualización automática de tu posición.
            </Text>
            <View style={styles.featureArrowAlt}>
              <Text style={styles.arrowTextAlt}>ⓘ</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Beneficios del Sistema */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Beneficios del Sistema</Text>
          <View style={styles.sectionUnderline} />
        </View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>🔊</Text>
            </View>
            <Text style={styles.featureTitle}>Guía por Voz</Text>
            <Text style={styles.featureDesc}>
              Indicaciones claras que te ayudan a conducir sin distraerte de la vía.
            </Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>⚡</Text>
            </View>
            <Text style={styles.featureTitle}>Rutas Optimizadas</Text>
            <Text style={styles.featureDesc}>
              Llega más rápido con rutas calculadas según tu ubicación y condiciones actuales.
            </Text>
            <View style={styles.featureArrowAlt}>
              <Text style={styles.arrowTextAlt}>ⓘ</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información del Sistema */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sobre el Sistema</Text>
          <View style={styles.sectionUnderline} />
        </View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <Text style={styles.featureTitle}>Nuestra Misión</Text>
            <Text style={styles.featureDesc}>
              Facilitar tu movilidad diaria ofreciendo una experiencia de navegación
              confiable, rápida y segura.
            </Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureEmoji}>🛠️</Text>
            </View>
            <Text style={styles.featureTitle}>Tecnología Avanzada</Text>
            <Text style={styles.featureDesc}>
              Integración con GPS, lectura de sensores y análisis en tiempo real para
              ofrecerte la mejor ruta siempre.
            </Text>
            <View style={styles.featureArrowAlt}>
              <Text style={styles.arrowTextAlt}>ⓘ</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  // Hero Section
  heroSection: {
    height: 500,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 58, 138, 0.7)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#BFDBFE',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  heroButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Stats White Section
  statsWhiteSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingTop: 30,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  statsHeader: {
    marginBottom: 20,
  },
  statsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statIconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#EFF6FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 28,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  sectionUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    position: 'relative',
  },
  featureIconWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF4ED',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 26,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginBottom: 10,
  },
  featureArrow: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 30,
    height: 30,
    backgroundColor: '#F0F9FF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#3B82F6',
  },
  featureArrowAlt: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 28,
    height: 28,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowTextAlt: {
    fontSize: 16,
    color: '#3B82F6',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navItem: {
    padding: 10,
  },
  navIcon: {
    width: 45,
    height: 45,
    backgroundColor: '#F5F5F5',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    backgroundColor: '#3B82F6',
  },
  navIconText: {
    fontSize: 20,
    color: '#666',
  },
});