import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function PatientCreate() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    nascimento: "",
    sexo: "",
    telefone: "",
    alergias: "",
    ativo: true,
  });

  const [loading, setLoading] = useState(false);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
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
      is_active: form.ativo,
    };

    try {
      setLoading(true);

      await api.post("/educators/patients", payload);

      nav("/pacientes");
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error?.response?.data ?? error);
      alert("Não foi possível cadastrar o paciente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-8">
        Cadastro de Pacientes
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
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
              type="email"
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
                className="w-full h-7 rounded px-2 text-base"
                value={form.nascimento}
                onChange={(e) => setField("nascimento", e.target.value)}
              />
            </div>

            <div>
              <label className="text-base font-serif">Sexo</label>
              <select
                className="w-full h-7 font-serif bg-sf-page rounded px-2 text-base"
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
                className="w-full h-7 rounded px-2 text-[12px]"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-base font-serif">Alergias</label>
            <textarea
              className="w-full h-20 rounded px-2 py-2 text-base"
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
              className="w-80 border border-sf-green text-sf-greenDark px-6 py-1 text-xl rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-80 bg-sf-greenDark hover:bg-sf-btnBlue text-white px-6 py-1 text-xl rounded disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}