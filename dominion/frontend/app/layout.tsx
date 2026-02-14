import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "The Dominion of Lord Zexo",
  description: "AI Multi-Agent Command Dashboard — SNES RPG Edition",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="scanlines">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-3 md:p-6 overflow-x-hidden overflow-y-auto pb-24 md:pb-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
