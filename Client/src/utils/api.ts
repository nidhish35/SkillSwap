import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
});

// attach token if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
