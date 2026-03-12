import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setServerError("");
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Informe o nome completo.";
    if (!form.email.trim()) newErrors.email = "Informe o e-mail.";
    if (!form.phone.trim()) newErrors.phone = "Informe o telefone.";
    if (!form.password) newErrors.password = "Informe a senha.";
    if (!form.password_confirmation) {
      newErrors.password_confirmation = "Confirme a senha.";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (
      form.password &&
      form.password_confirmation &&
      form.password !== form.password_confirmation
    ) {
      newErrors.password_confirmation = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
      };

      await api.post("/register", payload);

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);

      const responseErrors = error.response?.data?.errors;

      if (responseErrors) {
        const formattedErrors = {};
        Object.keys(responseErrors).forEach((key) => {
          formattedErrors[key] = responseErrors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        setServerError(
          error.response?.data?.message || "Não foi possível realizar o cadastro."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex">
      <aside className="w-[255px] bg-[#d9d9d9] flex items-start justify-center pt-8">
        <h1 className="text-white text-4xl font-serif tracking-wide">
          SYNCHRO FIT
        </h1>
      </aside>

      <main className="flex-1 bg-[#63b874] flex justify-center">
        <div className="w-full max-w-4xl px-10 py-10 flex flex-col">
          <h2 className="text-center text-white text-5xl font-serif mb-12">
            CADASTRO
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-white text-2xl font-serif mb-2">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full h-12 rounded-md px-4 text-lg bg-[#e9e9e9] outline-none"
                />
                {errors.name && (
                  <p className="text-red-100 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-2xl font-serif mb-2">
                  E-mail:
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="w-full h-12 rounded-md px-4 text-lg bg-[#e9e9e9] outline-none"
                />
                {errors.email && (
                  <p className="text-red-100 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-2xl font-serif mb-2">
                  Telefone:
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full h-12 rounded-md px-4 text-lg bg-[#e9e9e9] outline-none"
                />
                {errors.phone && (
                  <p className="text-red-100 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-white text-2xl font-serif mb-2">
                    Senha:
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    className="w-full h-12 rounded-md px-4 text-lg bg-[#e9e9e9] outline-none"
                  />
                  {errors.password && (
                    <p className="text-red-100 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-2xl font-serif mb-2">
                    Confirmar Senha:
                  </label>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) =>
                      setField("password_confirmation", e.target.value)
                    }
                    className="w-full h-12 rounded-md px-4 text-lg bg-[#e9e9e9] outline-none"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-100 text-sm mt-1">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {serverError && (
                <p className="text-red-100 text-base">{serverError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 pb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="h-12 rounded-md border-2 border-sky-500 text-white text-2xl font-serif hover:bg-sky-500/10 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-md bg-[#118df0] text-white text-xl font-serif hover:brightness-110 transition disabled:opacity-70"
              >
                {loading ? "Cadastrando..." : "CADASTRAR"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}