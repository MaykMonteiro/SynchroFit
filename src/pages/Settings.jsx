import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      password: "",
    });
  }, [user]);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const updatedUser = {
        ...user,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      setUser(updatedUser);

      alert("Configurações atualizadas com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert("Não foi possível atualizar as configurações.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    nav(-1);
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl md:text-5xl uppercase tracking-wide mb-8">
        Configurações
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-sf-panel rounded-2xl shadow-soft p-8 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div>
            <label className="block font-serif text-[18px] mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Telefone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="Digite apenas se quiser alterar"
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
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
            className="bg-blue-500 text-white rounded-md py-3 font-serif text-2xl disabled:opacity-70"
          >
            {saving ? "Atualizando..." : "ATUALIZAR"}
          </button>
        </div>
      </form>
    </div>
  );
}