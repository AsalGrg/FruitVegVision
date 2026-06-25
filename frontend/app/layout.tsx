import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AnimationSetup from "@/components/AnimationSetup";
import {ToolContextProvider} from '@/context/ToolsContext'


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FoodVeggie",
  description: "Measure your diet in a click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/lenis@1.3.23/dist/lenis.css"
        precedence="default"
      ></link>
      <body className="min-h-full flex flex-col bg-warm-white">
        <Navbar />
        <AnimationSetup>
          <ToolContextProvider>{children}</ToolContextProvider>
        </AnimationSetup>
      </body>
    </html>
  );
}
