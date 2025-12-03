// AutoridadForm.css
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  formBox: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#007AFF"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    color: "#333"
  },
  userBox: {
    backgroundColor: "#eef5ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center"
  },
  userText: {
    fontSize: 14,
    marginVertical: 3,
    color: "#333"
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10
  },
  input: {
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 15
  },
  pickerContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  labelText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: "500"
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12
  },
  dateInput: {
    flex: 1,
    marginBottom: 0
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8
  },
  newInstButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15
  },
  newInstButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
  backButton: {
    backgroundColor: "#8E8E93",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17
  },
  cancelButton: {
    padding: 10,
    marginBottom: 20
  },
  cancelText: {
    textAlign: "center",
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 16
  }
});

export default styles;