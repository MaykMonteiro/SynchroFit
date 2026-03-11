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

export default function Workout() {
  const nav = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchWorkouts() {
    try {
      setLoading(true);

      const response = await api.get("/educators/workouts");

      setWorkouts(response.data?.WorkoutData ?? response.data ?? []);
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const columns = [
    "NOME",
    "E-MAIL",
    "TELEFONE",
    "OBJETIVO",
    "INICIO ACOMP.",
    "AÇÕES",
  ];

  const rows = (workouts ?? []).map((w) => [
    w.name ?? "-",
    w.email ?? "-",
    w.phone ?? "-",
    w.workout_type_name ?? "-",
    formatDateBR(w.start_date),
    <div key={`actions-${w.id}`} className="flex items-center gap-2">
      <button
        onClick={() => nav(`/treinos/${w.id}/editar`)}
        className="text-blue-600 border border-blue-600 px-2 py-[2px] rounded"
      >
        Editar
      </button>
    </div>,
  ]);

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Treinos
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/treinos/cadastro")}
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