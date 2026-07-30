import type { Metadata } from "next";
import { SocietyProvider } from "../context/SocietyContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Society Connect Pro",
  description: "Society Management, Resident Dues & Gate Activity Console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-sky-50 via-blue-50/60 to-teal-50/80 min-h-screen text-sky-950 antialiased font-sans">
        <SocietyProvider>{children}</SocietyProvider>
      </body>
    </html>
  );
}
