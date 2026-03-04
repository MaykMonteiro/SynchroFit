import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const PatientsContext = createContext(null);

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPatients() {
    setLoading(true);
    try {
      const { data } = await api.get("/educators/patients");
      setPatients(data.data ?? data); // caso venha {data: [...]}
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function createPatient(payload) {
    try {
      const { data } = await api.post("/educators/patients", payload);
      const created = data.data ?? data;
      setPatients((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      throw error;
    }
  }

  async function deletePatient(id) {
    try {
      await api.delete(`/educators/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const value = useMemo(
    () => ({
      patients,
      loading,
      fetchPatients,
      createPatient,
      deletePatient,
    }),
    [patients, loading]
  );

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients precisa estar dentro de <PatientsProvider>.");
  return ctx;
}