import React from "react";

export default function Dashboard() {
  return (
    <div className="flex flex-col ">
      <h1 className="text-center text-textBlack font-serif text-4xl uppercase tracking-wide mt-10 mb-4">
        BEM VINDO AO SEU GESTOR DE PACIENTES.
      </h1>
      <div className="flex justify-center items-center bg-sf-bgGray h-72 rounded-md shadow-soft mt-20 text-[12px]">
        Conteúdo do Dashboard (UI primeiro).
      </div>
    </div>
  );
}