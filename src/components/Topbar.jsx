import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSettings() {
    setOpen(false);
    navigate("/configuracoes");
  }

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/");
  }

  return (
    <div className="h-12 flex items-center justify-end px-6">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-sf-green text-textBlack px-3 py-1 hover:opacity-90"
        >
          <span className="text-md">{user?.name ?? "USUÁRIO"}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
            >
              Configurações
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}