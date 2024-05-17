import React from "react";
import CardWrapper from "../auth-wrapper";
import LoginForm from "../auth/login-form";
import SocialButtons from "../auth/social-buttons";
import { Separator } from "../ui/separator";

function LoginPage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <CardWrapper
        title="Login"
        subtitle="Welcome back to our auth service"
        backButtonLink="/auth/register"
        backButtonText="Do not have an account? Register"
      >
        <div>
          <LoginForm />
          <Separator className="my-3" />
          <SocialButtons />
        </div>
      </CardWrapper>
    </div>
  );
}

export default LoginPage;
