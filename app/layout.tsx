import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authly",
  description: "An example of next authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/auth.png" sizes="any" />
        </head>
        <body className={inter.className + " w-full !overflow-x-hidden"}>
          <Toaster />
          <ThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem
          >
            <div className="w-full h-full max-h-screen flex flex-col">
              <Navbar />
              <div className="flex-grow flex flex-col items-center justify-center">
                {children}
                <div className="h-[40px] w-full border-t">
                  <div className="container h-full mx-auto flex flex-row items-center justify-center flex-wrap md:gap-7 gap-2">
                    <p className="text-sm text-muted-foreground">App created and designer by Giacomo Ruetta</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <p className="text-sm text-primary cursor-pointer hover:underline">Privacy Policy</p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Privacy Policy</DialogTitle>
                          <DialogDescription className="max-h-[350px] overflow-y-auto">
                            <div className="font-semibold my-2">
                              1. Introduction
                            </div>
                            <div>
                              This application is designed exclusively to demonstrate the development skills of Giacomo Ruetta. By using this application, you agree to the collection and use of information in accordance with this policy.
                            </div>
                            <div className="font-semibold my-2">
                              2. Information Collection and Use
                            </div>
                            <div>
                              The application collects only essential information necessary to manage user sessions. This includes:
                              <br />
                              - Cookies: We use functional cookies to manage and maintain user sessions. These cookies are necessary for the application to function correctly.
                              <br />
                              - Data Storage: User data is stored in a MongoDB database. This includes information such as usernames and other session-related data.
                            </div>
                            <div className="font-semibold my-2">
                              3. Data Security
                            </div>
                            <div>
                              We prioritize the security of your data. Sensitive information, such as passwords, is hashed before being stored. Hashing is an irreversible process, ensuring that the original password cannot be retrieved or reversed.
                            </div>
                            <div className="font-semibold my-2">
                              4. Data Usage
                            </div>
                            <div>
                              The data collected is used solely for the purpose of session management within the application. We do not share, sell, or use your data for any other purposes.
                            </div>
                            <div className="font-semibold my-2">
                              5. Changes to This Privacy Policy
                            </div>
                            <div>
                              We may update our Privacy Policy from time to time. Any changes will be posted on this page. You are advised to review this Privacy Policy periodically for any changes.
                            </div>
                            <div className="font-semibold my-2">
                              6. Contact Us
                            </div>
                            <div>
                              If you have any questions or suggestions about this Privacy Policy, do not hesitate to contact at <span className="text-primary">giaco.ruetta@gmail.com</span>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
