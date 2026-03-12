import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const PatientsContext = createContext(null);
const PATIENTS_ENDPOINT = "/educators/patients";

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPatients() {
    setLoading(true);
    try {
      const { data } = await api.get(PATIENTS_ENDPOINT);
      // debug: inspeciona resposta bruta e keys do primeiro item
      console.debug("DEBUG patients raw response:", data);

      const normalized = data.data ?? data;
      if (Array.isArray(normalized) && normalized.length > 0) {
        console.debug(
          "DEBUG patients sample keys:",
          Object.keys(normalized[0])
        );
      }

      setPatients(Array.isArray(normalized) ? normalized : []); // caso venha {data: [...]}
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function createPatient(payload) {
    try {
      const { data } = await api.post(PATIENTS_ENDPOINT, payload);
      const created = data.data ?? data;
      setPatients((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      throw error;
    }
  }

  async function updatePatient(id, payload) {
    const resolvedId = id ?? payload?.id ?? payload?.patient_id;
    if (resolvedId === null || resolvedId === undefined) {
      throw new Error("ID do paciente ausente para atualização.");
    }

    try {
      const { data } = await api.patch(`${PATIENTS_ENDPOINT}/${resolvedId}`, payload);
      const updated = data.data ?? data;

      setPatients((prev) =>
        prev.map((p) =>
          String(p.id ?? p.patient_id) === String(resolvedId)
            ? { ...p, ...updated }
            : p
        )
      );

      return updated;
    } catch (error) {
      console.log("PATCH status:", error?.response?.status);
      console.log("PATCH data:", JSON.stringify(error?.response?.data, null, 2));
      console.log("PATCH payload:", payload);
      console.error("Erro ao atualizar paciente:", error?.response?.data ?? error);
      throw error;
    }
  }

  async function deletePatient(id) {
    try {
      await api.delete(`${PATIENTS_ENDPOINT}/${id}`);
      setPatients((prev) =>
        prev.filter((p) => String(p.id ?? p.patient_id) !== String(id))
      );
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
      updatePatient,
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
