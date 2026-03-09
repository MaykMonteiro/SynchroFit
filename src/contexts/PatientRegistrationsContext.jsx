import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const PatientRegistrationsContext = createContext();

export function PatientRegistrationsProvider({ children }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchRegistrations() {
    try {
      setLoading(true);
      const response = await api.get("/educators/patient-registrations");

      setRegistrations(
        Array.isArray(response.data?.["Matrículas:"])
          ? response.data["Matrículas:"]
          : []
      );
    } catch (error) {
      console.error("Erro ao buscar matrículas:", error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PatientRegistrationsContext.Provider
      value={{
        registrations,
        loading,
        fetchRegistrations,
      }}
    >
      {children}
    </PatientRegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  return useContext(PatientRegistrationsContext);
}