import React from "react";
import CardWrapper from "../auth-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@/auth";

async function HomePage() {
  const session = await auth();

  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <CardWrapper title="Auth" subtitle="Welcome to our auth app">
        <div className="flex flex-row w-full gap-2">
          {session?.user ? (
            <>
              <Button asChild className="w-full" size={"lg"}>
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-[50%]" size={"lg"}>
                <Link href={"/auth/login"}>Login</Link>
              </Button>
              <Button
                asChild
                className="w-[50%]"
                size={"lg"}
                variant={"secondary"}
              >
                <Link href={"/auth/register"}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </CardWrapper>
    </main>
  );
}

export default HomePage;
