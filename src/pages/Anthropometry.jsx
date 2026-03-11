import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { api } from "../services/api";

function formatActivityLevel(level) {
  if (!level) return "-";

  const map = {
    light: "Leve",
    moderate: "Moderado",
    vigorous: "Vigoroso",
  };

  return map[level] ?? level;
}

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

function formatStatus(value) {
  return Number(value) === 1 ? "Ativo" : "Inativo";
}

export default function Anthropometry() {
  const nav = useNavigate();
  const [anthropometries, setAnthropometries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenAnthropometryIds, setHiddenAnthropometryIds] = useState([]);

  async function fetchAnthropometries() {
    try {
      setLoading(true);

      const response = await api.get("/educators/anthropometrys");

      setAnthropometries(
        Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Erro ao buscar antropometria:", error);
      setAnthropometries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnthropometries();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("hiddenAnthropometries") ?? "[]"
      );

      if (Array.isArray(saved)) {
        setHiddenAnthropometryIds(saved.map((id) => String(id)));
      }
    } catch {
      setHiddenAnthropometryIds([]);
    }
  }, []);

  function handleDelete(item) {
    const id = item.id ?? item.anthropometry_id;
    const stringId = String(id);

    const confirmDelete = window.confirm(
      "Deseja excluir este registro antropométrico?"
    );
    if (!confirmDelete) return;

    setHiddenAnthropometryIds((prev) => {
      if (prev.includes(stringId)) return prev;

      const next = [...prev, stringId];
      localStorage.setItem("hiddenAnthropometries", JSON.stringify(next));
      return next;
    });
  }

  const columns = [
    "NOME",
    "PESO INICIAL",
    "ALTURA",
    "GORDURA CORPORAL",
    "MÚSCULO CORPORAL",
    "ATV. FÍSICA",
    "TMB",
    "GET",
    "LESÕES",
    "AÇÕES",
  ];

  const rows = (anthropometries ?? [])
    .filter(
      (item) =>
        !hiddenAnthropometryIds.includes(String(item.id ?? item.anthropometry_id))
    )
    .map((item) => {
      const anthropometryId = item.id ?? item.anthropometry_id;

      return [
        item.name ?? "-",
        item.weights_initial ?? "-",
        item.height ?? "-",
        item.body_fat ?? "-",
        item.body_muscle ?? "-",
        formatActivityLevel(item.physical_activity_level),
        item.TMB ?? "-",
        item.GET ?? "-",
        item.lesions ?? "-",
        <div key={`actions-${anthropometryId}`} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav(`/antropometria/${anthropometryId}/editar`)}
            className="text-sf-green border border-green-600 px-2 py-[2px] rounded"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDelete(item)}
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
        Antropometria
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/antropometria/cadastro")}
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