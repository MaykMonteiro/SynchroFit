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

export default function Sidebar() {
  return (
    <aside className="w-[190px] bg-sf-green text-sf-textBlack">
      <div className="px-4 py-3 text-center mt-5 mb-16">
        <div className="text-lg font-serif uppercase">Menu</div>
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
  );
}