import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "block px-4 py-2 text-[12px] uppercase tracking-wide border-b border-black/10",
        isActive ? "bg-white/20" : "hover:bg-white/10",
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-[190px] bg-sf-green text-sf-ink">
      <div className="px-4 py-3 border-b border-black/10">
        <div className="text-[12px] font-serif uppercase">Menu</div>
      </div>

      <nav className="py-2">
        <Item to="/dashboard">Dashboard</Item>
        <Item to="/pacientes">Pacientes</Item>
      </nav>
    </aside>
  );
}