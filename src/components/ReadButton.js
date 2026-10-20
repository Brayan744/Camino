"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function ReadButton({ book, chapter, done }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, chapter, done: !done }),
      });
      router.refresh();
    } catch (e) {}
    setBusy(false);
  }

  return (
    <button onClick={toggle} disabled={busy} className={done ? "btn-ghost w-full" : "btn-primary w-full"}>
      <Check size={18} />
      {done ? "Leído · toca para deshacer" : "Marcar como leído"}
    </button>
  );
}