import React from "react";
import CardWrapper from "../auth-wrapper";
import RegisterForm from "../auth/register-form-wrapper";
import SocialButtons from "../auth/social-buttons";
import { Separator } from "../ui/separator";

function RegisterPage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <CardWrapper
        title="Register"
        subtitle="Welcome to our authentication service"
        backButtonLink="/auth/login"
        backButtonText="Do you have an account? Login"
      >
        <RegisterForm />
        <Separator className="my-3" />
        <SocialButtons />
      </CardWrapper>
    </div>
  );
}

export default RegisterPage;
