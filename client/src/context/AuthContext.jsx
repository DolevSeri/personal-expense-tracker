import { createContext, useEffect, useState } from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (userData) => {
    const response = await loginUser(userData);
    setUser(response.data);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
