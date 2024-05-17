import React from "react";
import CardWrapper from "../auth-wrapper";
import VerifyEmail from "../auth/verify-email";

function VerifyPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <CardWrapper
        title="Verify Email"
        subtitle="After register you need to verify your email"
      >
        <VerifyEmail />
      </CardWrapper>
    </main>
  );
}

export default VerifyPage;
