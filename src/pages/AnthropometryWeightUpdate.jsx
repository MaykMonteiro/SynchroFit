import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function AnthropometryWeightUpdate() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");

  const [form, setForm] = useState({
    weight: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    async function fetchAnthropometry() {
      try {
        setLoadingPage(true);

        const response = await api.get(`/educators/anthropometrys/${id}`);
        const data = response.data?.data ?? response.data ?? {};

        setPatientName(data.name ?? "Paciente");
        setPatientId(data.patient_id ?? "");
      } catch (error) {
        console.error("Erro ao buscar antropometria:", error);
        alert("Não foi possível carregar os dados.");
        nav("/antropometria");
      } finally {
        setLoadingPage(false);
      }
    }

    fetchAnthropometry();
  }, [id, nav]);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.weight) {
      alert("Informe o peso.");
      return;
    }

    if (!patientId) {
      alert("Paciente não encontrado.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/educators/patient-weights", {
        patient_id: Number(patientId),
        weight: Number(form.weight),
        current_date: form.date,
      });

      alert("Peso atualizado com sucesso.");
      nav("/antropometria");
    } catch (error) {
      console.error("Erro ao atualizar peso:", error);
      console.log("Resposta do backend:", error.response?.data);
      alert("Não foi possível salvar o peso.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return <div className="text-[12px]">Carregando...</div>;
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-6">
        Atualizar peso
      </h1>

      <section className="bg-sf-panel rounded-md shadow-soft p-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[16px] mb-2">Paciente</label>
            <input
              type="text"
              value={patientName}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-[16px] mb-2">Novo peso</label>
            <input
              type="number"
              step="0.01"
              value={form.weight}
              onChange={(e) => setField("weight", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Digite o peso"
            />
          </div>

          <div>
            <label className="block text-[16px] mb-2">Data da medição</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-sf-greenDark text-white px-6 py-2 rounded-xl"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={() => nav("/antropometria")}
              className="border border-gray-500 text-gray-700 px-6 py-2 rounded-xl"
            >
              Voltar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}