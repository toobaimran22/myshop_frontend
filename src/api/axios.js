import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // adjust port if needed
  withCredentials: true, // for session cookies
});

export default api;