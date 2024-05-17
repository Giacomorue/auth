import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authly",
  description: "An example of next authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/auth.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          enableSystem
        >
          <div className="w-full h-full flex flex-col">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
