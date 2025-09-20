import axios from 'axios'


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 5000, // 5 seconds
    headers: {'Content-Type': 'application/json'}
});

export default apiClient;