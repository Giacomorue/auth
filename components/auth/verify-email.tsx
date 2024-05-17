"use client";

import { VerifyEmailToken } from "@/actions/verifyEmailOtp";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import ErrorForm from "../error-form";
import SuccessForm from "../success-form";
import { MoonLoader } from "react-spinners";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";

function VerifyEmail() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    const callAction = () => {
      if (success || error) return;

      if (!token) {
        setError("Token not valid");
        return;
      }

      VerifyEmailToken(token)
        .then((response) => {
          if (!response) {
            return;
          }
          setError(response.error);
          if (response.success) {
            setSuccess("Email verified! Now yo can login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    callAction();
  }, [token, success, error]);

  return (
    <>
      {!error && !success && (
        <div className="flex flex-row items-center justify-center my-5">
          <MoonLoader color="grey" />
        </div>
      )}

      {success ? (
        <>
          <SuccessForm label={success} />
          <Separator className="my-3" />
          <Button asChild>
            <Link href={"/auth/login"} className="w-full">
              Login
            </Link>
          </Button>
        </>
      ) : (
        <>
          {error && (
            <>
              <ErrorForm label={error} />
              <Separator className="my-3" />
              <Button asChild variant={"secondary"}>
                <Link href={"/auth/register"} className="w-full">
                  Make an account
                </Link>
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default VerifyEmail;
