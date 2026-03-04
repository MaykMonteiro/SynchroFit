import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../contexts/PatientsContext";

export default function PatientCreate() {

  const nav = useNavigate();
  const { createPatient } = usePatients();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    nascimento: "",
    sexo: "",
    telefone: "",
    alergias: "",
    ativo: true
  });

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function salvar(e) {
  e.preventDefault();

  const payload = {
    name: form.nome,
    email: form.email,
    phone: form.telefone,
    birth_date: form.nascimento || null,
    gender: form.sexo || null,
    allergies: form.alergias || null,
    is_active: form.ativo
  };

  await createPatient(payload);

  nav("/pacientes");
  }

  return (
    <div>

      <h1 className="text-center font-serif text-2xl uppercase tracking-wide mb-4">
        Cadastro de Pacientes
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">

        <form onSubmit={salvar} className="space-y-4">

          <div>
            <label className="text-[12px] italic">Nome</label>
            <input
              className="w-full h-7 rounded px-2 text-[12px]"
              value={form.nome}
              onChange={(e)=>setField("nome", e.target.value)}
            />
          </div>

          <div>
            <label className="text-[12px] italic">E-mail</label>
            <input
              className="w-full h-7 rounded px-2 text-[12px]"
              value={form.email}
              onChange={(e)=>setField("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">

            <div>
              <label className="text-[12px] italic">Nascimento</label>
              <input
                type="date"
                className="w-full h-7 rounded px-2 text-[12px]"
                value={form.nascimento}
                onChange={(e)=>setField("nascimento", e.target.value)}
              />
            </div>

            <div>
              <label className="text-[12px] italic">Sexo</label>
                <select
                className="w-full h-7 rounded px-2 text-[12px]"
                value={form.sexo}
                onChange={(e)=>setField("sexo", e.target.value)}
                >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] italic">Telefone</label>
              <input
                className="w-full h-7 rounded px-2 text-[12px]"
                value={form.telefone}
                onChange={(e)=>setField("telefone", e.target.value)}
              />
            </div>

          </div>

          <div>
            <label className="text-[12px] italic">Alergias</label>
            <textarea
              className="w-full rounded px-2 py-2 text-[12px]"
              value={form.alergias}
              onChange={(e)=>setField("alergias", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[12px]">Inativo / Ativo</label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setField("ativo", e.target.checked)}
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">

            <button
              type="button"
              onClick={()=>nav("/pacientes")}
              className="border border-sf-green text-sf-green px-6 py-1 text-[12px] rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-sf-green text-white px-6 py-1 text-[12px] rounded shadow-soft"
            >
              Cadastrar
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}