"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";

export default function HeaderActions() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);

  function toggle() {
    const t = dark ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    setDark(!dark);
  }
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={toggle} aria-label="Cambiar modo" className="rounded-full p-2 text-muted hover:bg-line">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button onClick={logout} aria-label="Salir" className="rounded-full p-2 text-muted hover:bg-line">
        <LogOut size={18} />
      </button>
    </div>
  );
}