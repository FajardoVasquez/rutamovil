import React, { useState, useEffect } from 'react';
    import {
      View,
      Text,
      ScrollView,
      TouchableOpacity,
      Image,
      StyleSheet,
      Modal,
      Alert,
      ActivityIndicator
    } from 'react-native';
    import { getAuth, signOut } from '@react-native-firebase/auth';
    import Accidentes from './Accidentes';
    import MapaRutas from './Maparutaslogueado';

    export default function DashboardAutoridad({ userData, datosAutoridad, rol, onClose }) {
      const [perfilVisible, setPerfilVisible] = useState(false);
      const [mostrarAccidentes, setMostrarAccidentes] = useState(false);
      const [tabActiva, setTabActiva] = useState('inicio');
      const [noticias, setNoticias] = useState([]);
      const [cargandoNoticias, setCargandoNoticias] = useState(true);
      const auth = getAuth();

      // 🔍 Debug - Ver qué datos estamos recibiendo
      console.log('📊 Dashboard Autoridad - userData:', userData);
      console.log('📊 Dashboard Autoridad - datosAutoridad:', datosAutoridad);

      // Cargar noticias de tráfico y transporte
      useEffect(() => {
        const cargarNoticias = async () => {
          try {
            // Aquí puedes usar una API de noticias real como NewsAPI
            // const response = await fetch('https://newsapi.org/v2/everything?q=transporte+ecuador&apiKey=TU_API_KEY');
            // const data = await response.json();

            // Por ahora simulamos noticias
            const noticiasSimuladas = [
              {
                id: 1,
                titulo: 'Nuevas medidas de seguridad vial en Ecuador',
                descripcion: 'El gobierno implementa controles más estrictos en carreteras',
                fecha: 'Hace 3 horas',
                categoria: 'Seguridad'
              },
              {
                id: 2,
                titulo: 'Reducción del 15% en accidentes de tránsito',
                descripcion: 'Las estadísticas muestran mejoras en la seguridad vial',
                fecha: 'Hace 5 horas',
                categoria: 'Estadísticas'
              },
              {
                id: 3,
                titulo: 'Nuevo sistema de monitoreo GPS obligatorio',
                descripcion: 'Transportistas deberán implementar rastreo satelital',
                fecha: 'Hace 1 día',
                categoria: 'Tecnología'
              }
            ];

            setNoticias(noticiasSimuladas);
            setCargandoNoticias(false);
          } catch (error) {
            console.error('Error cargando noticias:', error);
            setCargandoNoticias(false);
          }
        };

        cargarNoticias();
      }, []);

      const togglePerfil = () => {
        setPerfilVisible(!perfilVisible);
      };

      const handleLogout = async () => {
        Alert.alert(
          '🔐 Cerrar Sesión',
          '¿Estás seguro que deseas cerrar sesión?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Cerrar Sesión',
              style: 'destructive',
              onPress: async () => {
                try {
                  await signOut(auth);
                  if (onClose) onClose();
                  Alert.alert('✅', 'Sesión cerrada exitosamente');
                } catch (error) {
                  console.error('Error al cerrar sesión:', error);
                  Alert.alert('❌ Error', 'No se pudo cerrar la sesión');
                }
              }
            }
          ]
        );
      };

      return (
        <View style={styles.container}>
          {/* HEADER ESTILO WHATSAPP */}
          <View style={styles.whatsappHeader}>
            <Text style={styles.headerTitle}>TransApp</Text>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconButton}>
                <Text style={styles.headerIcon}>🔍</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={togglePerfil}
              >
                <Text style={styles.headerIcon}>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MENÚ DE OPCIONES (aparece al tocar los tres puntos) */}
          <Modal
            visible={perfilVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={togglePerfil}
          >
            <TouchableOpacity
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={togglePerfil}
            >
              <View style={styles.menuDropdown}>
                <TouchableOpacity
                  style={styles.menuDropdownItem}
                  onPress={() => {
                    togglePerfil();
                    Alert.alert('👤 Perfil', 'Ver perfil completo');
                  }}
                >
                  <Text style={styles.menuDropdownText}>👤 Ver Perfil</Text>
                </TouchableOpacity>

                <View style={styles.menuDropdownDivider} />

                <TouchableOpacity
                  style={styles.menuDropdownItem}
                  onPress={() => {
                    togglePerfil();
                    handleLogout();
                  }}
                >
                  <Text style={[styles.menuDropdownText, styles.logoutText]}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* CONTENIDO PRINCIPAL */}
          <ScrollView style={styles.content}>
            {tabActiva === 'inicio' && (
              <>
                {/* Header de bienvenida */}
                <View style={styles.welcomeCard}>
                  <Text style={styles.welcomeTitle}>
                    Bienvenido, {userData?.displayName?.split(' ')[0] ||
                                datosAutoridad?.usuario?.nombre?.split(' ')[0] ||
                                'Usuario'} 👋
                  </Text>
                  <Text style={styles.welcomeSubtitle}>
                    {datosAutoridad?.cargo || 'Autoridad'} • {datosAutoridad?.institucion?.nombreInstitucion ||
                                                               datosAutoridad?.institucion?.nombre ||
                                                               'Institución'}
                  </Text>
                </View>

                {/* Tips de Seguridad Vial */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>🛡️ Tips de Seguridad Vial</Text>

                  <View style={styles.tipItem}>
                    <View style={styles.tipIcon}>
                      <Text style={styles.tipEmoji}>🚦</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>Mantén la distancia de seguridad</Text>
                      <Text style={styles.tipText}>Mantén al menos 3 segundos de distancia con el vehículo de adelante. En lluvia, aumenta a 6 segundos.</Text>
                    </View>
                  </View>

                  <View style={styles.tipItem}>
                    <View style={styles.tipIcon}>
                      <Text style={styles.tipEmoji}>😴</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>Descansa cada 2 horas</Text>
                      <Text style={styles.tipText}>La fatiga reduce los reflejos un 50%. Toma pausas de 15 minutos en viajes largos.</Text>
                    </View>
                  </View>

                  <View style={styles.tipItem}>
                    <View style={styles.tipIcon}>
                      <Text style={styles.tipEmoji}>🔧</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>Revisa tu vehículo antes de salir</Text>
                      <Text style={styles.tipText}>Verifica frenos, luces, neumáticos y niveles de fluidos. El 23% de accidentes son por fallas mecánicas.</Text>
                    </View>
                  </View>

                  <View style={styles.tipItem}>
                    <View style={styles.tipIcon}>
                      <Text style={styles.tipEmoji}>📱</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>No uses el celular al conducir</Text>
                      <Text style={styles.tipText}>Usar el móvil aumenta 4 veces el riesgo de accidentes. Activa el modo de conducción.</Text>
                    </View>
                  </View>
                </View>

                {/* Datos Curiosos sobre Transporte */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>💡 ¿Sabías que...?</Text>

                  <View style={styles.factItem}>
                    <Text style={styles.factIcon}>🌍</Text>
                    <View style={styles.factContent}>
                      <Text style={styles.factText}>
                        <Text style={styles.factBold}>Ecuador tiene 43,670 km de carreteras</Text>, de las cuales solo el 15% están asfaltadas.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.factItem}>
                    <Text style={styles.factIcon}>🚛</Text>
                    <View style={styles.factContent}>
                      <Text style={styles.factText}>
                        <Text style={styles.factBold}>El 80% del transporte de carga</Text> en Ecuador se realiza por carretera.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.factItem}>
                    <Text style={styles.factIcon}>⏱️</Text>
                    <View style={styles.factContent}>
                      <Text style={styles.factText}>
                        <Text style={styles.factBold}>La hora pico en Quito y Guayaquil</Text> aumenta los tiempos de viaje hasta en un 60%.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.factItem}>
                    <Text style={styles.factIcon}>🔒</Text>
                    <View style={styles.factContent}>
                      <Text style={styles.factText}>
                        <Text style={styles.factBold}>Usar el cinturón de seguridad</Text> reduce el riesgo de muerte en un 45% en accidentes.
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            {tabActiva === 'reportes' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📊 Reportes</Text>
                <Text style={styles.emptyText}>Sección de reportes en construcción...</Text>
              </View>
            )}

            {/* 👇 AQUÍ SE MUESTRA EL MAPA DE RUTAS */}
            {tabActiva === 'mapa' && (
              <View style={styles.mapaContainer}>
                <MapaRutas
                  userData={userData}
                  datosAutoridad={datosAutoridad}
                />
              </View>
            )}

            {tabActiva === 'notificaciones' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🔔 Notificaciones</Text>

                <View style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>⚠️</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Alerta de tráfico</Text>
                    <Text style={styles.notificationText}>Congestión en Av. Principal</Text>
                    <Text style={styles.notificationTime}>Hace 30 min</Text>
                  </View>
                </View>

                <View style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>🚛</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Nuevo transportista</Text>
                    <Text style={styles.notificationText}>Juan Pérez se ha registrado</Text>
                    <Text style={styles.notificationTime}>Hace 2 horas</Text>
                  </View>
                </View>

                <View style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationEmoji}>📄</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Documento pendiente</Text>
                    <Text style={styles.notificationText}>Revisa los documentos nuevos</Text>
                    <Text style={styles.notificationTime}>Hace 5 horas</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Espaciado inferior para que no se oculte con la barra */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* BARRA INFERIOR ESTILO WHATSAPP */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.bottomTab}
              onPress={() => setTabActiva('inicio')}
            >
              <Text style={[styles.bottomTabIcon, tabActiva === 'inicio' && styles.bottomTabIconActive]}>
                🏠
              </Text>
              <Text style={[styles.bottomTabText, tabActiva === 'inicio' && styles.bottomTabTextActive]}>
                Inicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomTab}
              onPress={() => setTabActiva('reportes')}
            >
              <Text style={[styles.bottomTabIcon, tabActiva === 'reportes' && styles.bottomTabIconActive]}>
                📊
              </Text>
              <Text style={[styles.bottomTabText, tabActiva === 'reportes' && styles.bottomTabTextActive]}>
                Reportes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomTab}
              onPress={() => setMostrarAccidentes(true)}
            >
              <View style={styles.bottomTabCenterButton}>
                <Text style={styles.bottomTabCenterIcon}>⚠️</Text>
              </View>
              <Text style={styles.bottomTabText}>Accidentes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomTab}
              onPress={() => setTabActiva('mapa')}
            >
              <Text style={[styles.bottomTabIcon, tabActiva === 'mapa' && styles.bottomTabIconActive]}>
                🗺️
              </Text>
              <Text style={[styles.bottomTabText, tabActiva === 'mapa' && styles.bottomTabTextActive]}>
                Mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomTab}
              onPress={() => setTabActiva('notificaciones')}
            >
              <View style={styles.badgeContainer}>
                <Text style={[styles.bottomTabIcon, tabActiva === 'notificaciones' && styles.bottomTabIconActive]}>
                  🔔
                </Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </View>
              <Text style={[styles.bottomTabText, tabActiva === 'notificaciones' && styles.bottomTabTextActive]}>
                Alertas
              </Text>
            </TouchableOpacity>
          </View>

          {/* MODAL DE ACCIDENTES - COMPONENTE REAL */}
          {mostrarAccidentes && (
            <Modal
              visible={true}
              animationType="slide"
              onRequestClose={() => setMostrarAccidentes(false)}
            >
              <Accidentes
                idAutoridad={datosAutoridad?.idAutoridad}
                onClose={() => setMostrarAccidentes(false)}
              />
            </Modal>
          )}
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F0F4FF'
      },

      // HEADER ESTILO WHATSAPP
      whatsappHeader: {
        backgroundColor: '#0084FF',
        paddingTop: 45,
        paddingBottom: 12,
        paddingHorizontal: 18,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderBottomWidth: 0.3,
        borderBottomColor: 'rgba(255,255,255,0.3)',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.20,
        shadowRadius: 4.5,
        elevation: 6,
      },

      headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF'
      },
      headerIcons: {
        flexDirection: 'row',
        gap: 20
      },
      headerIconButton: {
        padding: 5
      },
      headerIcon: {
        fontSize: 24,
        color: '#FFFFFF'
      },

      // MENÚ DROPDOWN
      menuOverlay: {
        flex: 1,
        backgroundColor: 'transparent'
      },
      menuDropdown: {
        position: 'absolute',
        top: 90,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        minWidth: 200,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.20,
        shadowRadius: 8,
        elevation: 8,

        borderWidth: 1,
        borderColor: '#E3F0FF'
      },
      menuDropdownItem: {
        paddingVertical: 15,
        paddingHorizontal: 20
      },
      menuDropdownText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#005BB5'
      },
      menuDropdownDivider: {
        height: 1,
        backgroundColor: '#E3F0FF',
        marginVertical: 5
      },
      logoutText: {
        color: '#DC3545'
      },

     // CONTENIDO
     content: {
       flex: 1,
       backgroundColor: '#F5F7FA', // fondo general suave
       paddingVertical: 20,
     },

     welcomeCard: {
       backgroundColor: '#FFFFFF',
       marginHorizontal: 20,
       marginVertical: 10,
       padding: 25,
       borderRadius: 16,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.1,
       shadowRadius: 6,
       elevation: 5,
       borderWidth: 1,
       borderColor: '#E0E5EC', // borde sutil tipo neumorphism
     },

     welcomeTitle: {
       fontSize: 24,
       fontWeight: '800',
       color: '#1B3A57', // azul profundo más elegante
       marginBottom: 8,
       letterSpacing: 0.5,
     },

     welcomeSubtitle: {
       fontSize: 16,
       color: '#52606D', // gris azulado moderno
       lineHeight: 22,
     },

      // ESTADÍSTICAS
      statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 10,
        marginBottom: 15
      },
      statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
      },
      statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0084FF',
        marginBottom: 3
      },
      statLabel: {
        fontSize: 12,
        color: '#667781',
        textAlign: 'center'
      },

      // CARDS
      card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#005BB5'
      },

     // TIPS DE SEGURIDAD
           tipItem: {
             flexDirection: 'row',
             paddingVertical: 16,
             paddingHorizontal: 16,
             backgroundColor: '#F8FBFF',
             borderRadius: 12,
             marginBottom: 12,
             borderLeftWidth: 4,
             borderLeftColor: '#0084FF'
           },
           tipIcon: {
             width: 50,
             height: 50,
             borderRadius: 25,
             backgroundColor: '#FFFFFF',
             justifyContent: 'center',
             alignItems: 'center',
             marginRight: 15,
             shadowColor: '#0084FF',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.1,
             shadowRadius: 4,
             elevation: 3
           },
           tipEmoji: {
             fontSize: 26
           },
           tipContent: {
             flex: 1,
             justifyContent: 'center'
           },
           tipTitle: {
             fontSize: 16,
             color: '#1A1A1A',
             fontWeight: '700',
             marginBottom: 6
           },
           tipText: {
             fontSize: 14,
             color: '#667781',
             lineHeight: 20
           },

     // DATOS CURIOSOS - DISEÑO MEJORADO
     factItem: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       paddingVertical: 14,
       paddingHorizontal: 16,
       marginVertical: 6,
       backgroundColor: '#FFFFFF',
       borderRadius: 12,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.08,
       shadowRadius: 6,
       elevation: 3, // para Android
     },

     factIcon: {
       fontSize: 36,
       marginRight: 14,
       marginTop: 2,
       color: '#005BB5', // ícono con color distintivo
     },

     factContent: {
       flex: 1,
     },

     factText: {
       fontSize: 15,
       color: '#4A5568', // un gris más moderno
       lineHeight: 22,
     },

     factBold: {
       fontWeight: '700',
       color: '#1E40AF', // azul más profundo y elegante
     },


      // MAPA
      mapaContainer: {
        flex: 1,
        minHeight: 560,
        marginHorizontal: 0,
        marginBottom: 0
      },

      quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5'
      },
      quickActionIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#E3F0FF', // azul suave
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
      },
      quickActionEmoji: {
        fontSize: 24
      },
      quickActionContent: {
        flex: 1
      },
      quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#005BB5',
        marginBottom: 2
      },
      quickActionSubtitle: {
        fontSize: 13,
        color: '#667781'
      },


      activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EAF2FF', // azul claro
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      },
      activityEmoji: {
        fontSize: 20
      },
      activityContent: {
        flex: 1
      },
      activityTitle: {
        fontSize: 15,
        color: '#005BB5',
        fontWeight: '500',
        marginBottom: 3
      },
      activityTime: {
        fontSize: 13,
        color: '#667781'
      },


      // NOTIFICACIONES
      notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5'
      },
      notificationIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#E3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      },
      notificationEmoji: {
        fontSize: 22
      },
      notificationContent: {
        flex: 1
      },
      notificationTitle: {
        fontSize: 15,
        color: '#005BB5',
        fontWeight: '600',
        marginBottom: 3
      },
      notificationText: {
        fontSize: 14,
        color: '#667781',
        marginBottom: 3
      },
      notificationTime: {
        fontSize: 12,
        color: '#999'
      },

      emptyText: {
        fontSize: 15,
        color: '#667781',
        textAlign: 'center',
        paddingVertical: 20
      },

      // BARRA INFERIOR ESTILO WHATSAPP
      bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8
      },
      bottomTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5
      },
      bottomTabIcon: {
        fontSize: 24,
        marginBottom: 3,
        opacity: 0.6
      },
      bottomTabIconActive: {
        opacity: 1,
        color: '#0084FF' // activo azul
      },
      bottomTabText: {
        fontSize: 11,
        color: '#667781',
        fontWeight: '500'
      },
      bottomTabTextActive: {
        color: '#0084FF',
        fontWeight: '600'
      },

      bottomTabCenterButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0084FF', // antes verde → ahora azul
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
      },
      bottomTabCenterIcon: {
        fontSize: 26,
        color: '#fff'
      },

      // BADGE
      badgeContainer: {
        position: 'relative'
      },
      notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -8,
        backgroundColor: '#0084FF', // azul badge
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF'
      },
      notificationBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700'
      }
    });
