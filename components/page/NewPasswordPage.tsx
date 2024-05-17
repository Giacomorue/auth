import React from "react";
import CardWrapper from "../auth-wrapper";
import LoginForm from "../auth/login-form";
import SocialButtons from "../auth/social-buttons";
import { Separator } from "../ui/separator";
import ResetPasswordForm from "../auth/reset-password-form";
import NewPasswordForm from "../auth/new-password-form";

function NewPasswordPage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <CardWrapper
        title="New password"
        subtitle="Insert your new password and confirm it"
        backButtonLink="/auth/login"
        backButtonText="Do you want to retun to login?"
      >
        <div>
          <NewPasswordForm />
        </div>
      </CardWrapper>
    </div>
  );
}

export default NewPasswordPage;
