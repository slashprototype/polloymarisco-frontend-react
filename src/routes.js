import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

// import layouts
import MainLayoutComponent from "./layouts/MainLayout";
// Import pages
import LoginPage from "./pages/Login/Login";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DashboardPrecios from "./pages/Dashboard/DashboardPrecios";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Add your routes here */}
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayoutComponent />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/precios" element={<DashboardPrecios />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
