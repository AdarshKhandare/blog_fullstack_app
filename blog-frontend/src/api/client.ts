import axios from "axios";

const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  auth: {
    google: `${API_URL}/auth/google`,
    facebook: `${API_URL}/auth/facebook`,
    callback: "/auth/callback", // Frontend route to handle callbacks
  },
  posts: {
    list: `${API_URL}/posts`,
    detail: (id: string) => `${API_URL}/posts/${id}`,
    create: `${API_URL}/posts`,
    update: (id: string) => `${API_URL}/posts/${id}`,
    delete: (id: string) => `${API_URL}/posts/${id}`,
    userPosts: `${API_URL}/posts/user/posts`,
  },
};

// Storage keys
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Define user type
interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown; // Use 'unknown' instead of 'any'
}

// Auth utilities
export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Handle OAuth callbacks by extracting tokens from URL
  handleAuthCallback: (search: string) => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const userData = params.get("user");

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        auth.setToken(token);
        auth.setUser(user);
        return true;
      } catch (e) {
        console.error("Failed to parse user data", e);
        return false;
      }
    }
    return false;
  },
};

// Define data type for requests
type RequestData = Record<string, unknown>;

// API client with auth headers
export const apiClient = {
  get: async (url: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = auth.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    return response.json();
  },

  post: async (url: string, data: RequestData) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = auth.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (url: string, data: RequestData) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = auth.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (url: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = auth.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });
    return response.json();
  },
};
