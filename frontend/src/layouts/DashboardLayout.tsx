import {
  useState
} from "react";
import type {ReactNode} from "react";

import Navbar
  from "../components/Navbar";

import Sidebar
  from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
      "
    >

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div
        className="
          min-h-screen
          lg:pl-72
        "
      >

        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main
          className="
            p-4
            sm:p-8
          "
        >
          {children}
        </main>

      </div>

    </div>

  );
}