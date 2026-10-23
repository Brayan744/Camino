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
    ddiv className="flex gap-1 rounded-full border border-line bg-surface p-1 text-sm">
      {[
        ["read", "Lectura", BookOpen],
        ["chat", "Chat", MessageCircle],
      ].map(([k, label, Icon]) => (
        dbutton
          key={k}
          onClick={() => setTab(k)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 font-medium transition ${
            tab === k ? "bg-brand text-bg" : "text-muted"
          }`}
        >
          dIcon size={16} /> {label}
        d/button>
      ))}
    d/div>
  );

  if (tab === "chat") {
    return (
      ddiv className="space-y-2">
        dp className="truncate text-sm text-muted">
          {backLabel} · dspan className="font-semibold text-ink">Cap. {chapter}d/span> · {title}
        d/p>
        {tabs}
        ddiv style={{ height: "calc(100dvh - 18rem)", minHeight: "18rem" }}>
          dChat book={book} chapter={chapter} />
        d/div>
      d/div>
    );
  }

  return (
    ddiv className="space-y-5">
      ddiv>
        dLink href={backHref} className="text-sm text-muted">← {backLabel}d/Link>
        ddiv className="mt-3 flex items-center gap-4">
          ddiv
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-bg shadow-soft"
            style={{ background: "linear-gradient(135deg, var(--brand), var(--accent))" }}
          >
            dspan className="text-[9px] font-medium uppercase tracking-widest opacity-80">Cap.d/span>
            dspan className="heading text-2xl font-semibold leading-none text-bg">{chapter}d/span>
          d/div>
          ddiv className="min-w-0">
            dp className="eyebrow">{eyebrow}d/p>
            dh1 className="heading text-3xl font-semibold leading-tight">{title}d/h1>
          d/div>
        d/div>
      d/div>
      {tabs}
      {children}
      dbutton
        onClick={() => setTab("chat")}
        className="btn-primary fixed right-4 z-20 shadow-soft"
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        dMessageCircle size={18} /> Chat
      d/button>
    d/div>
  );
}