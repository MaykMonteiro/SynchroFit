import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const PatientRegistrationsContext = createContext();

export function PatientRegistrationsProvider({ children }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchRegistrations() {
    try {
      setLoading(true);
      const response = await api.get("/educators/patient-registrations");

      console.debug("DEBUG registrations raw response:", response.data);

      const normalized = Array.isArray(response.data?.["Matrículas:"])
        ? response.data["Matrículas:"]
        : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];

      if (Array.isArray(normalized) && normalized.length > 0) {
        const keySet = Array.from(
          new Set(normalized.flatMap((r) => Object.keys(r || {})))
        );
        console.debug("DEBUG registrations sample keys:", keySet);
      }

      setRegistrations(normalized);
    } catch (error) {
      console.error("Erro ao buscar matrículas:", error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRegistrations();
  }, []);

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