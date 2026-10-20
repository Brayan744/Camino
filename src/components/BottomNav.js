"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Map as MapIcon, Clock, Compass } from "lucide-react";

const ITEMS = [
  { href: "/inicio", label: "Inicio", Icon: Home, match: ["/inicio", "/libro", "/repaso"] },
  { href: "/biblia", label: "Biblia", Icon: BookOpen, match: ["/biblia"] },
  { href: "/mapa", label: "Mapa", Icon: MapIcon, match: ["/mapa"] },
  { href: "/linea-del-tiempo", label: "Tiempo", Icon: Clock, match: ["/linea-del-tiempo"] },
  { href: "/como-leer", label: "Guía", Icon: Compass, match: ["/como-leer"] },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-2xl">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match.some((m) => path === m || path.startsWith(m + "/"));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-brand font-semibold" : "text-muted"}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}