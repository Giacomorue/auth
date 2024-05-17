import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backButtonText?: string;
  backButtonLink?: string;
}

function CardWrapper({
  children,
  title,
  subtitle,
  backButtonText,
  backButtonLink,
}: AuthWrapperProps) {
  return (
    <Card className="w-[400px] max-w-full shadow-sm shadow-card-foreground/30">
      <CardHeader className="w-full text-center">
        <h1 className="text-4xl font-semibold text-center pb-1">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground text-center">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        {backButtonLink && backButtonText && (
          <Button variant={"link"} asChild className="text-center w-full">
            <Link href={backButtonLink}>{backButtonText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
