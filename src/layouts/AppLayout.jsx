import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full flex bg-sf-page">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-10 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}