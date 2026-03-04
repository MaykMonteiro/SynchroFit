import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 bg-sf-panel flex items-center justify-center">
        <div className="text-white/80 font-serif text-6xl tracking-wide drop-shadow">
          GYMTRACK
        </div>
      </div>

      <div className="w-[360px] bg-sf-green flex items-center justify-center">
        <div className="w-full max-w-[280px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}