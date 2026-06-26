// Centralized API configuration for CREDEX.io frontend
// Reads VITE_API_URL from environment variables at build/run time, with local fallback
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
