import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 bg-sf-bgGray flex items-center justify-center">
        <div className="text-sf-textWhite font-serif-4 text-8xl tracking-normal">
          SYNCHRO FIT
        </div>
      </div>

      <div className="w-[420px] bg-sf-greenDark">
        <div className="w-full px-2 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}