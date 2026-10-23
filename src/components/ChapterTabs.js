"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";
import Chat from "./Chat";

export default function ChapterTabs({ book, chapter, backHref, backLabel, eyebrow, title, initial = "read", children }) {
  const [tab, setTab] = useState(initial);

  useEffect(() => {
    const open = () => setTab("chat");
    window.addEventListener("open-chat", open);
    return () => window.removeEventListener("open-chat", open);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tab !== "chat") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [tab]);

  const tabs = (
    <div className="flex gap-1 rounded-full border border-line bg-surface p-1 text-sm">
      {[
        ["read", "Lectura", BookOpen],
        ["chat", "Chat", MessageCircle],
      ].map(([k, label, Icon]) => (
        <button
          key={k}
          onClick={() => setTab(k)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 font-medium transition ${
            tab === k ? "bg-brand text-bg" : "text-muted"
          }`}
        >
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );

  if (tab === "chat") {
    return (
      <div className="space-y-2">
        <p className="truncate text-sm text-muted">
          {backLabel} · <span className="font-semibold text-ink">Cap. {chapter}</span> · {title}
        </p>
        {tabs}
        <div style={{ height: "calc(100dvh - 18rem)", minHeight: "18rem" }}>
          <Chat book={book} chapter={chapter} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href={backHref} className="text-sm text-muted">← {backLabel}</Link>
        <div className="mt-3 flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-bg shadow-soft"
            style={{ background: "linear-gradient(135deg, var(--brand), var(--accent))" }}
          >
            <span className="text-[9px] font-medium uppercase tracking-widest opacity-80">Cap.</span>
            <span className="heading text-2xl font-semibold leading-none text-bg">{chapter}</span>
          </div>
          <div className="min-w-0">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="heading text-3xl font-semibold leading-tight">{title}</h1>
          </div>
        </div>
      </div>
      {tabs}
      {children}
      <button
        onClick={() => setTab("chat")}
        className="btn-primary fixed right-4 z-20 shadow-soft"
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <MessageCircle size={18} /> Chat
      </button>
    </div>
  );
}