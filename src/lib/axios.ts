import axios from "axios";
import { clearAuth } from "@/utils/storage";
import { toast } from "sonner";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor to handle token expiration & unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== "undefined" && error.response && error.response.status === 401) {
            clearAuth();
            
            // Prevent infinite redirect loops if already on login or home page
            if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
                toast.error("Session expired. Redirecting to login...");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;