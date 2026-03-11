import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";

export default function AnthropometryCreate() {
  const nav = useNavigate();
  const { registrations = [], loading } = useRegistrations();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    weights_initial: "",
    height: "",
    body_fat: "",
    body_muscle: "",
    physical_activity_level: "",
    TMB: "",
    GET: "",
    lesions: "",
    active: true,
  });

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function normalizeDecimalInput(value) {
    return String(value ?? "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
  }

  function formatDecimalForApi(value) {
    const normalized = String(value ?? "").replace(",", ".").trim();

    if (!normalized) return null;

    const numberValue = Number(normalized);

    if (Number.isNaN(numberValue)) return null;

    return Number(numberValue.toFixed(2));
  }

  function formatIntegerForApi(value) {
    const normalized = String(value ?? "").trim();

    if (!normalized) return null;

    const numberValue = Number(normalized);

    if (Number.isNaN(numberValue)) return null;

    return Math.trunc(numberValue);
  }

  const registeredPatients = useMemo(() => {
    const normalized = (registrations ?? [])
      .map((item) => {
        const patientId =
          item.patient_id ??
          item.patient?.id ??
          item.id_patient ??
          null;

        const patientName =
          item.patient_name ??
          item.patient?.name ??
          item.name ??
          "Paciente sem nome";

        return {
          patient_id: patientId,
          patient_name: patientName,
        };
      })
      .filter((item) => item.patient_id);

    return normalized.filter(
      (item, index, self) =>
        index === self.findIndex((p) => p.patient_id === item.patient_id)
    );
  }, [registrations]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      patient_id: formatIntegerForApi(form.patient_id),
      weights_initial: formatDecimalForApi(form.weights_initial),
      height: formatDecimalForApi(form.height),
      body_fat: formatDecimalForApi(form.body_fat),
      body_muscle: formatDecimalForApi(form.body_muscle),
      physical_activity_level: form.physical_activity_level,
      TMB: formatIntegerForApi(form.TMB),
      GET: formatIntegerForApi(form.GET),
      lesions: form.lesions?.trim() ? form.lesions.trim() : null,
    };

    try {
      setSaving(true);

      await api.post("/educators/anthropometrys", payload);

      nav("/antropometria");
    } catch (error) {
      console.error("Erro ao cadastrar antropometria:", error);
      console.error("Payload enviado:", payload);
      alert("Não foi possível cadastrar a antropometria.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    nav("/antropometria");
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl md:text-5xl uppercase tracking-wide mb-8">
        Cadastro Antropométrico
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-sf-panel rounded-2xl shadow-soft p-8 max-w-5xl mx-auto"
      >
        <div className="mb-6">
          <label className="block font-serif text-[18px] mb-2">
            Nome Paciente
          </label>

          <select
            value={form.patient_id}
            onChange={(e) => setField("patient_id", e.target.value)}
            className="w-full bg-white rounded-md px-4 py-3 outline-none"
            required
          >
            <option value="">
              {loading
                ? "Carregando pacientes matriculados..."
                : "Selecione um paciente"}
            </option>

            {registeredPatients.map((patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {patient.patient_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block font-serif text-[18px] mb-2">Altura</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.height}
              onChange={(e) =>
                setField("height", normalizeDecimalInput(e.target.value))
              }
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Peso Inicial
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.weights_initial}
              onChange={(e) =>
                setField("weights_initial", normalizeDecimalInput(e.target.value))
              }
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Gordura Corporal
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.body_fat}
              onChange={(e) =>
                setField("body_fat", normalizeDecimalInput(e.target.value))
              }
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Músculo Corporal
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.body_muscle}
              onChange={(e) =>
                setField("body_muscle", normalizeDecimalInput(e.target.value))
              }
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-serif text-[18px] mb-2">
              Nível de Atv. Física
            </label>
            <select
              value={form.physical_activity_level}
              onChange={(e) =>
                setField("physical_activity_level", e.target.value)
              }
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            >
              <option value="">Selecione</option>
              <option value="light">Leve</option>
              <option value="moderate">Moderado</option>
              <option value="vigorous">Vigoroso</option>
            </select>
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Taxa Metabólica Basal
            </label>
            <input
              type="number"
              value={form.TMB}
              onChange={(e) => setField("TMB", e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Gasto Energético Total
            </label>
            <input
              type="number"
              value={form.GET}
              onChange={(e) => setField("GET", e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              required
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-serif text-[18px] mb-2">Lesões</label>
          <textarea
            value={form.lesions}
            onChange={(e) => setField("lesions", e.target.value)}
            className="w-full bg-white rounded-md px-4 py-3 outline-none min-h-[120px] resize-none"
          />
        </div>

        <div className="flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setField("active", !form.active)}
            className={`relative w-10 h-6 rounded-full border-2 transition ${
              form.active
                ? "bg-sf-greenDark border-sf-greenDark"
                : "bg-white border-black"
            }`}
          >
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition ${
                form.active
                  ? "right-1 bg-white"
                  : "left-1 bg-white border border-black"
              }`}
            />
          </button>

          <span className="font-serif text-[18px]">
            {form.active ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-green-600 text-green-600 rounded-md py-3 font-serif text-2xl"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#97c89f] text-white rounded-md py-3 font-serif text-2xl disabled:opacity-70"
          >
            {saving ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}