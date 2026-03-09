import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { usePatients } from "../contexts/PatientsContext.jsx";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";

export default function Patients() {
  const nav = useNavigate();
  const { patients, loading, fetchPatients } = usePatients();
  const { registrations, fetchRegistrations } = useRegistrations();
  const [hiddenPatientIds, setHiddenPatientIds] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchRegistrations();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hiddenPatients") ?? "[]");
      if (Array.isArray(saved)) {
        setHiddenPatientIds(saved.map((id) => String(id)));
      }
    } catch {
      setHiddenPatientIds([]);
    }
  }, []);

  const handleDelete = (p) => {
    const id = p.id ?? p.patient_id;
    const stringId = String(id);

    const confirmDelete = window.confirm("Deseja excluir este paciente?");
    if (!confirmDelete) return;

    setHiddenPatientIds((prev) => {
      if (prev.includes(stringId)) return prev;
      const next = [...prev, stringId];
      localStorage.setItem("hiddenPatients", JSON.stringify(next));
      return next;
    });
  };

  const columns = ["NOME", "E-MAIL", "TELEFONE", "PLANO", "INICIO ACOMP.", "FIM ACOMP.", "AÇÕES"];

  const registrationsByPatientId = Array.isArray(registrations)
    ? registrations.reduce((acc, registration) => {
        const patientId = String(registration.patient_id ?? "");
        if (patientId) {
          acc[patientId] = registration;
        }
        return acc;
      }, {})
    : {};

  const rows = (patients ?? [])
    .filter((p) => (p.is_active ?? p.ativo ?? 1) == 1)
    .filter((p) => !hiddenPatientIds.includes(String(p.id ?? p.patient_id)))
    .map((p) => {
      const patientId = p.id ?? p.patient_id;
      const registration = registrationsByPatientId[String(patientId)];

      return [
        p.nome ?? p.name ?? "-",
        p.email ?? "-",
        p.telefone ?? p.phone ?? "-",
        registration?.plan_description ?? p.plano ?? p.plan ?? "-",
        registration?.start_date ?? p.inicioAcomp ?? p.start_date ?? "-",
        registration?.end_date ?? p.fimAcomp ?? p.end_date ?? "-",
        <div key={`actions-${patientId}`} className="flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => nav(`/pacientes/${patientId}/editar`)}
            className="text-sf-green border border-green-600 px-2 py-[2px] rounded"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => nav(`/pacientes/${patientId}/matricula`)}
            className="border border-blue-600 text-blue-600 px-2 py-[2px] rounded"
          >
            Matrícula
          </button>

          <button
            type="button"
            onClick={() => handleDelete(p)}
            className="border border-red-600 text-red-600 px-2 py-[2px] rounded"
          >
            Excluir
          </button>

        </div>,
      ];
    });

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Pacientes
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/pacientes/cadastro")}
          className="bg-sf-greenDark text-white px-6 py-1 text-sm rounded-xl"
        >
          CADASTRE
        </button>
      </div>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        {loading ? (
          <div className="text-[12px]">Carregando...</div>
        ) : (
          <Table columns={columns} rows={rows} />
        )}
      </div>
    </div>
  );
}