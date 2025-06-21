import { create } from "zustand";
import axios from "axios"

const API_URL = (import.meta.env.VITE_PRODUCTION == "true") ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_DEPLOYMENT_URL;
// const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: false,
    message: null,

    signUp: async (email, password, name) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/signup`, { email, password, name }, {withCredentials: true});
                set({ user: response.data.user, isAuthenticated: true, isLoading: false});
                return response.data;
            } catch (error) {
                set({isLoading: false});
                return error.response?.data || { message: 'An unknown error occurred' };
            }
    },

    logIn: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password }, {withCredentials: true});
			set({
				isAuthenticated: true,
				user: response.data.user,
				isLoading: false,
			});
            return response.data;

		} catch (error) {
			set({isLoading: false});
            return error.response?.data || { message: "Error Logging in" };
		}
    },

    verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({isLoading: false});
            return error.response?.data || { message: "Error in verifying email" };
		}
    },

    checkAuth: async () => {
            set({ isCheckingAuth: true, error: null });
            try {
                const response = await axios.get(`${API_URL}/check-auth`);
                set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            } catch (error) {
                set({ error: null, isCheckingAuth: false, isAuthenticated: false });
				throw error;
            }
    },

    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

    resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
            return response.data;
		} catch (error) {
			set({isLoading: false});
			return error.response?.data || { message: "Error in reset password" };
		}
	},

    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
            return response.data;
		} catch (error) {
			set({isLoading: false});
			return error.response?.data || { message: "Error in forgot password" };
		}
	},
}))
