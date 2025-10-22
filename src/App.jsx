import "./App.css";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { useState } from "react";

export default function App() {
  const token = localStorage.getItem("adminToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
      </Routes>
    </div>
  );
}
