import { createContext, useContext, useState } from "react";
import authServiceEntrenador from "../services/authServiceEntrenador";

const AuthContextEntrenador = createContext();

export function AuthProviderEntrenador({ children }) {
  const [entrenador, setEntrenador] = useState(
    authServiceEntrenador.getEntrenador()
  );

  const login = async (email, password) => {
    const res = await authServiceEntrenador.login(email, password);
    if (res.success) {
      setEntrenador(res.entrenador);
    }
    return res;
  };

  const logout = () => {
    authServiceEntrenador.logout();
    setEntrenador(null);
  };

  return (
    <AuthContextEntrenador.Provider
      value={{
        entrenador,
        login,
        logout,
        isAuthenticated: !!entrenador,
      }}
    >
      {children}
    </AuthContextEntrenador.Provider>
  );
}

export default function useAuthEntrenador() {
  return useContext(AuthContextEntrenador);
}
