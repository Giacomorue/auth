import React from "react";
import CardWrapper from "../auth-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";

function HomePage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <CardWrapper title="Auth" subtitle="Welcome to our auth app">
        <div className="flex flex-row w-full gap-2">
          <Button asChild className="w-[50%]" size={"lg"}>
            <Link href={"/auth/login"}>Login</Link>
          </Button>
          <Button asChild className="w-[50%]" size={"lg"} variant={"secondary"}>
            <Link href={"/auth/register"}>Register</Link>
          </Button>
        </div>
      </CardWrapper>
    </main>
  );
}

export default HomePage;
