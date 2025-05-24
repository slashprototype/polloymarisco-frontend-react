import React from 'react';
import { Outlet } from 'react-router-dom';
import "./auth-layout.css";
const AuthLayout = () => {
  return (
    <div className="bg-layout" > {/* Estilos para el layout de autenticación */}
      <h1>Welcome (Auth Layout)</h1>
      <Outlet /> {/* Aquí se renderizarán los componentes Login y Register */}
    </div>
  );
};

export default AuthLayout;
