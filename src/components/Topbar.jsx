import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-12 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <div className="text-[11px] bg-sf-green text-white px-3 py-1 rounded-full shadow-soft">
          {user?.name ?? "USUÁRIO"}
        </div>
        <button
          onClick={logout}
          className="text-[11px] underline opacity-70 hover:opacity-100"
        >
          sair
        </button>
      </div>
    </div>
  );
}