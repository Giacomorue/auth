import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { signIn } from "@/auth";

function SocialButtons() {

  const onButtonClick = async (provider: "google" | "github") => {
    
  }

  return (
    <div className="flex flex-row items-center justify-center gap-2 w-full">
      <form className="w-full" action={async () => {
        "use server"
        await signIn("google", {
          redirectTo: "/dashboard"
        });
      }}>
        <Button className="w-full" variant={"secondary"} size={"lg"} >
          <FcGoogle className="w-6 h-6" />
        </Button>
      </form>
      <form className="w-full" action={async () => {
        "use server"
        await signIn("github", {
          redirectTo: "/dashboard"
        });
      }}>
        <Button className="w-full" variant={"secondary"} size={"lg"} >
          <FaGithub className="w-6 h-6" />
        </Button>
      </form>
    </div>
  );
}

export default SocialButtons;
