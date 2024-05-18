"use client";

import React from "react";
import ThemeSwitcher from "./theme-switcher";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";
import { signOut, useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  console.log("Session:", session);
  console.log("Status:", status);

  const logout = async () => {
    await signOut();
  };

  return (
    <div className="w-full h-[70px] border-b shadow-sm shadow-foreground/20">
      <div className="h-full container mx-auto flex flex-row items-center justify-between">
        <Link
          href={"/"}
          className="text-3xl font-bold flex flex-row gap-2 items-center"
        >
          <Image
            src={"/auth.png"}
            alt="logo"
            width={40}
            height={40}
            className="sm:block hidden"
          />
          Authly
        </Link>
        <div className="flex flex-row gap-2">
          <ThemeSwitcher />
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="text-primary-foreground bg-primary">
                    {session?.user?.name &&
                      session?.user?.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
