import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Camino de la Palabra",
  description: "Estudio bíblico en pareja: lean, avancen y crezcan juntos.",
  icons: { icon: "/icons/192", apple: "/icons/192" },
  appleWebApp: { capable: true, title: "Camino", statusBarStyle: "default" },
};

export const viewport = { themeColor: "#2d3a6b", width: "device-width", initialScale: 1 };

const themeScript =
  "try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.dataset.theme=t}catch(e){}";

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}