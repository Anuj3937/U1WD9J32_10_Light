import axios from "axios";
import qs from "qs";
import { create } from "zustand"; 
const API_URL = "http://localhost:5000/api/users"; // Update this if needed

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Register User
  register: async (firstName, lastName, email, password) => {
    try {
      await axios.post(
        `${API_URL}/`,
        qs.stringify({ firstName, lastName, email, password }), // form-encoded
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      await useAuthStore.getState().fetchProfile(); // Fetch user profile after register
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed.");
    }
  },

  // Login User
  login: async (email, password) => {
    try {
      await axios.post(
        `${API_URL}/auth`,
        qs.stringify({ email, password }), // form-encoded
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      await useAuthStore.getState().fetchProfile(); // Fetch user profile after login
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  },

  // Logout User
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed.");
    }
  },

  // Fetch User Profile
  fetchProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });
      set({ user: response.data, isAuthenticated: true });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));