import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { api } from "../services/api";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

function formatObjective(text) {
  if (!text) return "-";
  if (text.length <= 30) return text;
  return `${text.slice(0, 30)}...`;
}

export default function Diets() {
  const nav = useNavigate();
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchDiets() {
    try {
      setLoading(true);

      const response = await api.get("/educators/diets");

      setDiets(response.data?.diets ?? []);
    } catch (error) {
      console.error("Erro ao buscar dietas:", error);
      setDiets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDiets();
  }, []);

  const columns = [
    "NOME",
    "E-MAIL",
    "TELEFONE",
    "OBJETIVO",
    "INICIO ACOMP.",
    "AÇÕES",
  ]

  const rows = (diets ?? []).map((diet) => [
    diet.patient_name ?? "-",
    diet.email ?? "-",
    diet.phone ?? "-",
    formatObjective(diet.objective),
    formatDateBR(diet.start_date),
    <div key={`actions-${diet.id}`} className="flex items-center gap-2">
      <button
        onClick={() => nav(`/dietas/${diet.id}/editar`)}
        className="text-blue-600 border border-blue-600 px-2 py-[2px] rounded"
      >
        Editar
      </button>
    </div>,
  ]);

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Dietas
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/dietas/cadastro")}
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