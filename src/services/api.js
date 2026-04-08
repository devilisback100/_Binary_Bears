import axios from "axios";


console.log('[API] Base URL:', process.env.REACT_APP_API_BASE_URL);
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('[API] Request:', config.method?.toUpperCase(), config.url, config);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', response.config.url, response.status, response.data);
        return response.data; // unwrap {success, data} → just data
    },
    (error) => {
        console.error('[API] Error:', error.config?.url, error.message, error.response);
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;