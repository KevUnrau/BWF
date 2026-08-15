import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useApi = () => {
  const { token, login } = useAuth();
  const apiFetch = async (endpoint, options = {}) => {
    let headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { authorization: `bearer ${token}` } : {}),
    };
    let opt = { ...options, headers: headers };
    let response = await fetch(`${API_BASE_URL}${endpoint}`, opt);
    let data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message);
      error.status = response.status;
      if (error.status === 401) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshResponse.json();
        if (refreshResponse.ok) {
          login(refreshData.user, refreshData.token);
          headers = {
            ...headers,
            authorization: `bearer ${refreshData.token}`,
          };
          opt = { ...opt, headers: headers };
          response = await fetch(`${API_BASE_URL}${endpoint}`, opt);
          data = await response.json();
          if (!response.ok) {
            const error = new Error(data.message);
            error.status = response.status;
            throw error;
          }
        } else {
          const error = new Error(refreshResponse.message);
          error.status = refreshResponse.status;
          throw error;
        }
      } else {
        throw error;
      }
    }
    return data;
  };
  return { apiFetch };
};

export const fetchApiWithoutRetry = async (endpoint, options = {}) => {
  let headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  let opt = { ...options, headers: headers };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, opt);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message);
    error.status = response.status;
    throw error;
  }
  return data;
};
