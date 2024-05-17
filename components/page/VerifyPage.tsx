import React, { Suspense } from "react";
import CardWrapper from "../auth-wrapper";
import VerifyEmail from "../auth/verify-email";
import Spinner from "../spinner";

function VerifyPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <CardWrapper
        title="Verify Email"
        subtitle="After register you need to verify your email"
      >
        <Suspense fallback={<Spinner />}>
          <VerifyEmail />
        </Suspense>
      </CardWrapper>
    </main>
  );
}

export default VerifyPage;
