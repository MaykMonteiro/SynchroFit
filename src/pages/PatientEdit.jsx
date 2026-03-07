import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../contexts/PatientsContext";

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function PatientEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const { patients, loading, fetchPatients, updatePatient } = usePatients();

  const patient = useMemo(
    () => (patients ?? []).find((p) => String(p.id ?? p.patient_id) === String(id)),
    [patients, id]
  );

  const [form, setForm] = useState({
    nome: "",
    email: "",
    nascimento: "",
    sexo: "",
    telefone: "",
    alergias: "",
    ativo: true,
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

    setForm({
      nome: patient.nome ?? patient.name ?? "",
      email: patient.email ?? "",
      nascimento: toDateInputValue(patient.nascimento ?? patient.birth_date),
      sexo: patient.sexo ?? patient.gender ?? "",
      telefone: patient.telefone ?? patient.phone ?? "",
      alergias: patient.alergias ?? patient.allergies ?? "",
      ativo: (patient.ativo ?? patient.is_active ?? 1) == 1,
    });
  }, [patient]);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function salvar(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.nome,
      email: form.email,
      phone: form.telefone,
      birth_date: form.nascimento || null,
      gender: form.sexo || null,
      allergies: form.alergias || null,
      is_active: form.ativo ? 1 : 0,
    };

    try {
      setSaving(true);
      await updatePatient(id, payload);
      await fetchPatients();
      nav("/pacientes");
    } catch (err) {
      console.error("Erro ao editar paciente:", err);
      setError("Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !patient) {
    return <div className="text-[12px]">Carregando...</div>;
  }

  if (!patient) {
    return (
      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <p className="text-[12px] mb-4">Paciente não encontrado.</p>
        <button
          type="button"
          onClick={() => nav("/pacientes")}
          className="border border-sf-green text-sf-green px-6 py-1 text-[12px] rounded"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-8">
        Edição de Paciente
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        {error ? (
          <div className="mb-3 text-base p-2 rounded bg-red-100 text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="text-base font-serif">Nome</label>
            <input
              className="w-full h-7 rounded px-2 text-[12px]"
              value={form.nome}
              onChange={(e) => setField("nome", e.target.value)}
            />
          </div>

          <div>
            <label className="text-base font-serif">E-mail</label>
            <input
              className="w-full h-7 rounded px-2 text-[12px]"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-base font-serif">Nascimento</label>
              <input
                type="date"
                className="w-full h-7 rounded px-2 text-[12px]"
                value={form.nascimento}
                onChange={(e) => setField("nascimento", e.target.value)}
              />
            </div>

            <div>
              <label className="text-base font-serif">Sexo</label>
              <select
                className="w-full h-7 bg-white rounded px-2 text-base"
                value={form.sexo}
                onChange={(e) => setField("sexo", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="text-base font-serif">Telefone</label>
              <input
                className="w-full h-7 rounded px-2 text-base"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-base font-serif">Alergias</label>
            <textarea
              className="w-full rounded px-2 py-2 text-base"
              value={form.alergias}
              onChange={(e) => setField("alergias", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-base font-serif">Inativo / Ativo</label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setField("ativo", e.target.checked)}
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => nav("/pacientes")}
              className="w-80 border border-sf-green text-sf-greenDark px-6 py-1 text-lg rounded"
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-80 bg-sf-green text-white px-6 py-1 text-lg rounded hover:bg-sf-btnBlue disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
