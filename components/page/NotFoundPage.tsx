import React from "react";
import CardWrapper from "../auth-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";

function NotFoundPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <CardWrapper
        title="Page not found"
        subtitle="The page that you are looking for does not exist."
      >
        <Button asChild className="w-full" size={"lg"}>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </CardWrapper>
    </main>
  );
}

export default NotFoundPage;
