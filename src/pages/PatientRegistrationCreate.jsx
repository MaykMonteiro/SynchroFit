import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../contexts/PatientsContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

function formatDateToInput(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateEndDate(startDate, planDescription) {
  if (!startDate || !planDescription) return "";

  const date = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  if (planDescription === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (planDescription === "quarterly") {
    date.setMonth(date.getMonth() + 3);
  } else if (planDescription === "semiannual") {
    date.setMonth(date.getMonth() + 6);
  } else {
    return "";
  }

  return formatDateToInput(date);
}

export default function PatientRegistrationCreate() {
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { patients, loading, fetchPatients } = usePatients();

  const patient = useMemo(
    () => (patients ?? []).find((p) => String(p.id ?? p.patient_id) === String(id)),
    [patients, id]
  );

  const [form, setForm] = useState({
    name: "",
    plan_description: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patients?.length) {
      fetchPatients();
    }
  }, [patients, fetchPatients]);

  useEffect(() => {
    if (!patient) return;

    setForm((prev) => ({
      ...prev,
      name: patient.name ?? patient.nome ?? "",
    }));
  }, [patient]);

    function setField(field, value) {
        setForm((prev) => {
            const next = {
            ...prev,
            [field]: value,
            };

            if (field === "start_date" || field === "plan_description") {
            const calculatedEndDate = calculateEndDate(
                field === "start_date" ? value : next.start_date,
                field === "plan_description" ? value : next.plan_description
            );

            next.end_date = calculatedEndDate;
            next.finalized_at = calculatedEndDate;
            }

            return next;
        });
    }

  async function salvar(e) {
    e.preventDefault();
    setError("");

    const payload = {
      patient_id: Number(id),
      educator_id: user?.id ?? 1,
      plan_description: form.plan_description,
      start_date: form.start_date,
      end_date: form.end_date,
      finalized_at: form.finalized_at || null,
    };

    try {
      setSaving(true);
      await api.post("/educators/patient-registrations", payload);
      nav("/pacientes");
    } catch (err) {
      console.error("Erro ao cadastrar matrícula:", err?.response?.data ?? err);
      setError("Não foi possível cadastrar a matrícula.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-center font-serif text-3xl uppercase tracking-wide text-[#2f2f2f]">
        Matrícula do Paciente
      </h1>

      <div className="mx-auto max-w-5xl rounded-md bg-sf-panel p-6 shadow-soft">
        {error ? (
          <div className="mb-4 rounded bg-red-100 p-2 text-[12px] text-red-700">
            {error}
          </div>
        ) : null}

        {loading && !patient ? (
          <div className="text-[12px]">Carregando...</div>
        ) : (
          <form onSubmit={salvar}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <label className="mb-1 block text-[12px] font-semibold text-[#4a4a4a]">
                  Nome
                </label>
                <input
                  className="h-7 w-full rounded bg-white px-2 text-[12px]"
                  value={form.name}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#4a4a4a]">
                  Plano de Acompanhamento
                </label>
                <select
                  className="h-7 w-full rounded bg-white px-2 text-[12px]"
                  value={form.plan_description}
                  onChange={(e) => setField("plan_description", e.target.value)}
                  required
                >
                  <option value="">Opções</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="semiannual">Semestral</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#4a4a4a]">
                  Início do Acompanhamento
                </label>
                <input
                  type="date"
                  className="h-7 w-full rounded bg-white px-2 text-[12px]"
                  value={form.start_date}
                  onChange={(e) => setField("start_date", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#4a4a4a]">
                  Fim do Acompanhamento
                </label>
                <input
                  type="date"
                  className="h-7 w-full rounded bg-white px-2 text-[12px]"
                  value={form.end_date}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#4a4a4a]">
                  Finalização do Acompanhamento
                </label>
                <input
                  type="date"
                  className="h-7 w-full rounded bg-white px-2 text-[12px]"
                  value={form.finalized_at}
                  onChange={(e) => setField("finalized_at", e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => nav("/pacientes")}
                style={{
                  width: "190px",
                  height: "42px",
                  borderRadius: "6px",
                  border: "1px solid #2f7d57",
                  color: "#2f7d57",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  width: "190px",
                  height: "42px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#2f7d57",
                  color: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}