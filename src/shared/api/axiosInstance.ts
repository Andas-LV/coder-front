import axios from "axios";
import { getAuthToken } from "@/core/config/cookie";

const isClient = typeof window !== "undefined";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// 👉 Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
	if (isClient) {
		const token = getAuthToken();

		if (!token) {
			console.warn("⚠️ No access token available! Request may fail.");
		} else {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

export default axiosInstance;
