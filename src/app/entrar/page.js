import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Entrar · Camino de la Palabra" };

export default function Entrar() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="eyebrow mb-2">Camino de la Palabra</p>
      <h1 className="heading mb-6 text-3xl font-semibold">Bienvenidos</h1>
      <AuthForm />
    </main>
  );
}