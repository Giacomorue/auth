import React from "react";
import CardWrapper from "../auth-wrapper";
import LoginForm from "../auth/login-form";
import SocialButtons from "../auth/social-buttons";
import { Separator } from "../ui/separator";
import ResetPasswordForm from "../auth/reset-password-form";

function ResetPasswordPage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <CardWrapper
        title="Reset password"
        subtitle="Insert your email t recive the password change link"
        backButtonLink="/auth/login"
        backButtonText="Do you want to retun to login?"
      >
        <div>
            <ResetPasswordForm />
        </div>
      </CardWrapper>
    </div>
  );
}

export default ResetPasswordPage;
