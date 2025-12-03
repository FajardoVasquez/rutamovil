// Styles/TransportistaForm.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  formBox: {
    width: "92%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#34C759"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
    paddingLeft: 5
  },
  userBox: {
    backgroundColor: "#e8f5e9",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#34C759"
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#34C759"
  },
  userText: {
    fontSize: 15,
    marginVertical: 3,
    color: "#333",
    fontWeight: "500"
  },
  labelText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
    paddingLeft: 5
  },
  input: {
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0"
  },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden"
  },
  picker: {
    height: 50
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 4
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 10,
    marginVertical: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3"
  },
  infoText: {
    fontSize: 13,
    color: "#1976D2",
    lineHeight: 18
  },
  button: {
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  buttonDisabled: {
    backgroundColor: "#a8e6b5",
    opacity: 0.7
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 10
  },
  cancelText: {
    color: "#FF3B30",
    fontWeight: "700",
    fontSize: 16
  }
});