import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { login, authLoading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    await login(email, senha);
    nav("/dashboard");
  }

  return (
    <div className="text-white">
      <div className="text-center font-serif text-[14px] mb-4 uppercase">
        Login
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <div className="text-[11px] mb-1">E-mail:</div>
          <input
            className="w-full h-7 rounded px-2 text-black text-[12px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-[11px] mb-1">Senha:</div>
          <input
            type="password"
            className="w-full h-7 rounded px-2 text-black text-[12px]"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        <button
          disabled={authLoading}
          className="w-full h-7 rounded bg-sf-greenDark text-white text-[12px] shadow-soft disabled:opacity-60"
          type="submit"
        >
          {authLoading ? "ENTRANDO..." : "ENTRAR"}
        </button>

        <div className="text-center text-[11px] opacity-90">
          <Link to="/cadastro" className="underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}