import api from "./api";

const API_URL = "/api/auth";

export const registerUser = (userData) => {
  return api.post(`${API_URL}/register`, userData);
};

export const loginUser = (userData) => {
  return api.post(`${API_URL}/login`, userData);
};

export const logoutUser = () => {
  return api.post(`${API_URL}/logout`);
};

export const getMe = () => {
  return api.get(`${API_URL}/me`);
};
