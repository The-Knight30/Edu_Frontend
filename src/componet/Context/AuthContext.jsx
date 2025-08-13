import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import Cookies from "cookie-universal";
export const AuthProvider = ({ children }) => {
  // Initialize Email and studentId with values from local storage
  const cookies = Cookies();
  const storedStudentId = cookies.get("id") || null;
  const [Email, setEmail] = useState(null);
  const [studentId, setStudentId] = useState(storedStudentId);
  const [auth, setAuth] = useState({ role: "" });
  // Update local storage whenever studentId changes
  useEffect(() => {
    cookies.set("id", studentId);
  }, [studentId]);

  // Function to handle login
  const login = (email, id) => {
    setEmail(email);
    setStudentId(id);
  };

  return (
    <AuthContext.Provider value={{ Email, login, studentId, auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
