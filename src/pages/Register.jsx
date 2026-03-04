import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="text-white">
      <div className="text-center font-serif text-[14px] mb-4 uppercase">
        Cadastro
      </div>

      <div className="text-[12px] opacity-90">
        (Vamos montar essa tela depois, igual ao layout.)
      </div>

      <div className="text-center text-[11px] mt-4 opacity-90">
        <Link to="/" className="underline">
          voltar para login
        </Link>
      </div>
    </div>
  );
}