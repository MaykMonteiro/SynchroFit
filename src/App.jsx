import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientCreate from "./pages/PatientCreate.jsx";
import PatientEdit from "./pages/PatientEdit.jsx";
import PatientRegistrationCreate from "./pages/PatientRegistrationCreate";
import Workout from "./pages/Workout";
import Diets from "./pages/Diets";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<Patients />} />
        <Route path="/pacientes/cadastro" element={<PatientCreate />} />
        <Route path="/pacientes/:id/editar" element={<PatientEdit />} />
        <Route path="/pacientes/:id/matricula" element={<PatientRegistrationCreate />} />
        <Route path="/treinos" element={<Workout />} />
        <Route path="/dietas" element={<Diets />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
