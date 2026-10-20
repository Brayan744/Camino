import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import HeaderActions from "@/components/HeaderActions";
import BottomNav from "@/components/BottomNav";

export default async function AppLayout({ children }) {
  const user = await getUser();
  if (!user) redirect("/entrar");
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/inicio" className="heading text-xl font-semibold">Camino de la Palabra</Link>
          <HeaderActions />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}