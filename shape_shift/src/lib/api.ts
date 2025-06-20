import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.error || 'Login failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
}

export async function getCurrentUser() {
    try{
        const res = await axios.get("http://localhost:5000/api/auth/user", { withCredentials: true });
        return res.data;
    }catch (error) {
        console.error('Failed to fetch current user:', error);
        throw error;
    }
}

export async function registerUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", { email, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}
export async function logoutUser() {
    try {
        const response = await api.post("/auth/logout");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Logout failed');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error(error.message);
        }
    }
}