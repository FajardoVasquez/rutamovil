import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Contenedor general
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: { padding: 5 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  placeholder: { width: 50 },

  // CONTENIDO
  content: { flex: 1, padding: 15 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  sectionSubtitle: { fontSize: 16, fontWeight: '600', color: '#555', marginTop: 15, marginBottom: 10 },

  // LABELS E INPUTS
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },

  // BOTONES
  mapButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  mapButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  addButton: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: { backgroundColor: '#999' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // ITEMS
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  itemSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  deleteButton: { fontSize: 14, color: '#FF3B30', fontWeight: '600', padding: 5 },

  // PICKER
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  picker: { height: 50 },

  // RADIO BUTTONS
  radioGroup: { flexDirection: 'row', marginBottom: 15, gap: 15 },
  radioButton: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', flex: 1 },
  radioButtonSelected: { borderColor: '#007AFF', backgroundColor: '#E8F4FF' },
  radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#007AFF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  radioCircleSelected: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#007AFF' },
  radioLabel: { fontSize: 16, color: '#333' },

  // NUEVO TIPO
  nuevoTipoContainer: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 8, marginTop: 10, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#007AFF' },
  nuevoTipoTitle: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginBottom: 10 },

  // MAPAS
  map: { flex: 1, borderRadius: 10, marginBottom: 15 },
  coordsContainer: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginBottom: 10 },
  coordsText: { fontSize: 12, color: '#666', textAlign: 'center' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  modalButtonCancel: { flex: 1, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, alignItems: 'center' },
  modalButtonTextCancel: { color: '#666', fontSize: 16, fontWeight: '600' },
  modalButtonConfirm: { flex: 1, backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  modalButtonTextConfirm: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // LINKS
  linkButton: { paddingVertical: 8, marginBottom: 12 },
  linkButtonText: { color: '#007AFF', fontSize: 14, textDecorationLine: 'underline' },

  // LOADING
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  loadingAddressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f8ff', padding: 10, borderRadius: 8, marginBottom: 10 },
  loadingAddressText: { marginLeft: 10, fontSize: 14, color: '#007AFF' },

  // ADDRESS PREVIEW
  addressPreview: { backgroundColor: '#f0f8ff', padding: 12, borderRadius: 8, marginBottom: 10 },
  addressPreviewTitle: { fontSize: 14, fontWeight: '600', color: '#007AFF', marginBottom: 5 },
  addressPreviewText: { fontSize: 13, color: '#333', lineHeight: 18 },

  // MAP MODAL
  mapModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  mapModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '85%' },
  mapInstructions: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },
});
