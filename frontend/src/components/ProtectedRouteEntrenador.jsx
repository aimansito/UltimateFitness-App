import { Navigate } from "react-router-dom";
import useAuthEntrenador from "../context/AuthContextEntrenador";

function ProtectedRouteEntrenador({ children }) {
  const { entrenador } = useAuthEntrenador();

  if (!entrenador) {
    return <Navigate to="/entrenador/login" replace />;
  }

  return children;
}

export default ProtectedRouteEntrenador;
