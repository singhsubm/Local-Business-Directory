import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://local-business-directory-ktc2.onrender.com/api", // Backend URL
  withCredentials: true, // BAHUT ZARURI: Tabhi browser cookie bhejega/save karega
});

export default api;