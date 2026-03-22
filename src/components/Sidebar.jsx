import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "block px-4 py-2 text-md text-center uppercase tracking-wide border-b border-black/10",
        isActive ? "border border-sf-textWhite" : "hover:bg-white",
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      <aside
        className={[
          "fixed top-0 left-0 h-screen bg-sf-green text-sf-textBlack z-50",
          "transition-transform duration-300 ease-in-out",
          "w-[190px]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-4 py-3 mt-5 mb-16">
          <div className="flex items-center justify-start gap-3">
            <button
              onClick={onToggle}
              className="flex flex-col justify-center items-center gap-1 w-10 h-10 rounded hover:bg-white/20 transition"
              aria-label="Mostrar ou esconder menu"
              type="button"
            >
              <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
              <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
              <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
            </button>

            <div className="text-lg font-serif uppercase">Menu</div>
          </div>
        </div>

        <nav className="py-2">
          <Item to="/dashboard">Dashboard</Item>
          <Item to="/pacientes">Pacientes</Item>
          <Item to="/treinos">Treinos</Item>
          <Item to="/dietas">Dietas</Item>
          <Item to="/antropometria">Antropometria</Item>
          <Item to="/reports">Relatórios</Item>
          <Item to="/feedback">Feedback</Item>
        </nav>
      </aside>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-4 z-50 flex flex-col justify-center items-center gap-1 w-10 h-10 rounded bg-sf-green hover:bg-sf-green/90 transition"
          aria-label="Abrir menu"
          type="button"
        >
          <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
          <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
          <span className="block w-6 h-[2px] bg-sf-textBlack"></span>
        </button>
      )}
    </>
  );
}