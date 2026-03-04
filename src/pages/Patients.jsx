import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { usePatients } from "../contexts/PatientsContext.jsx";

export default function Patients() {
  const nav = useNavigate();
  const { patients, loading } = usePatients();
  const { deletePatient } = usePatients();

  const columns = ["NOME", "E-MAIL", "TELEFONE", "PLANO", "INÍCIO ACOMP.", "FIM ACOMP."];

  const rows = (patients ?? []).map((p) => [
    p.nome ?? p.name ?? "-",
    p.email ?? "-",
    p.telefone ?? p.phone ?? "-",
    p.plano ?? p.plan ?? "-",
    p.inicioAcomp ?? p.start_date ?? "-",
    p.fimAcomp ?? p.end_date ?? "-",
  ]);

  return (
    <div>
      <h1 className="text-center font-serif text-2xl uppercase tracking-wide mb-4">
        Pacientes
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/pacientes/cadastro")}
          className="bg-sf-green text-white px-6 py-1 text-[12px] rounded shadow-soft"
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