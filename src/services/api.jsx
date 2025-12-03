// services/api.js
import axios from "axios";

const API = axios.create({
   baseURL: "http://192.168.54.43:8080/api",
    // baseURL: "http://192.168.1.173:8080/api",
  timeout: 8000,
});

export default API;
