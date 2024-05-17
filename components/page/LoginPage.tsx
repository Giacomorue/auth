import React, { Suspense } from "react";
import CardWrapper from "../auth-wrapper";
import LoginForm from "../auth/login-form";
import SocialButtons from "../auth/social-buttons";
import { Separator } from "../ui/separator";
import Spinner from "../spinner";

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
          <Suspense fallback={<Spinner />}>
            <LoginForm />
          </Suspense>
          <Separator className="my-3" />
          <SocialButtons />
        </div>
      </CardWrapper>
    </div>
  );
}

export default LoginPage;
