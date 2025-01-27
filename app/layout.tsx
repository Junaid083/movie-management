import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Movie Database",
  description: "A full stack movie database application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans antialiased bg-[#093545]`}
      >
        <AuthProvider>
          <main className="min-h-screen flex flex-col">
            {children}
            <Footer />
          </main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
