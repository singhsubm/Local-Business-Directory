import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Backend URL
  withCredentials: true, // BAHUT ZARURI: Tabhi browser cookie bhejega/save karega
});

export default api;