"use client";

import { FormSchemaLogin, FormSchemaResetPassword } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import * as z from "zod";
import Spinner from "../spinner";
import { Input } from "../ui/input";
import ErrorForm from "../error-form";
import SuccessForm from "../success-form";
import { Button } from "../ui/button";
import { Login, RequestLoginTWoFA } from "@/actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { useCountdown } from "@/hook/useTimer";

type LoginFormType = z.infer<typeof FormSchemaLogin>;

function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [disabledInput, setDisabledInput] = useState(false);
  const [passwordFormType, setPasswordFormType] = useState<"password" | "text">(
    "password"
  );
  const [twoFactorCode, setTwoFactorCode] = useState<string | undefined>(
    undefined
  );
  const [userId, setUserId] = useState<string | undefined>();

  const [formState, setFormState] = useState<"Login" | "2FA">("Login");

  const searchParams = useSearchParams();

  const errorInUrl = searchParams.get("error");

  useEffect(() => {
    if (errorInUrl === "OAuthAccountNotLinked") {
      setError("Accout already exist with other provider");
      router.push("/auth/login");
    } else if (errorInUrl === "OAuthCallbackError") {
      setError("something went wrong!");
      router.push("/auth/login");
    }
  }, [errorInUrl]);

  const formLogin = useForm<LoginFormType>({
    resolver: zodResolver(FormSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitLogin = (data: LoginFormType) => {
    console.log("Button pressed");

    startTransition(() => {
      Login(data, twoFactorCode)
        .then((response) => {
          if (!response) return;

          if (!response.twoFactor) {
            setTwoFactorCode(undefined);
            setFormState("Login");
          }

          if (response.success && !response.twoFactor) {
            setError(undefined);
            setSuccess("Login correct!");
            setDisabledInput(true);
            router.push("/dashboard");
            stop();
            return;
          }
          if (response.success && response.twoFactor) {
            setError(undefined);
            setSuccess(response.success);
            setTwoFactorCode("");
            setFormState("2FA");
            setUserId(response.userId);
            start();
            return;
          }

          if (!response.twoFactor) {
            formLogin.reset();
          } else {
            start();
          }

          setError(response.error);
          console.log(response);
          setSuccess(undefined);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const onRequestAnotherEmail = () => {
    if (!userId) return;

    if (isActive) return;

    startTransition(() => {
      setTwoFactorCode(undefined);
      setError(undefined);
      setSuccess(undefined);

      RequestLoginTWoFA(userId)
        .then((response) => {
          if (!response) return;

          setError(response.error);

          if (response.success) {
            setSuccess("New 2FA code sent to your email!");
            start();
          }
        })
        .catch((err) => {
          setError("Something went wrong!");
          console.log(err);
        });
    });
  };

  const { seconds, start, stop, isActive } = useCountdown({
    duration: 30, // durata del countdown in secondi
    onComplete: () => {
      stop();
    },
  });

  return (
    <>
      {isPending && <Spinner />}
      <Form {...formLogin}>
        <form
          onSubmit={formLogin.handleSubmit(onSubmitLogin)}
          className="space-y-2"
        >
          {formState === "Login" ? (
            <>
              <FormField
                control={formLogin.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isPending || disabledInput}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="pb-2 space-y-1">
                    <FormLabel className="text-sm">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={passwordFormType}
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div
                        className="absolute right-3 p-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer"
                        onClick={() => {
                          if (passwordFormType === "text") {
                            setPasswordFormType("password");
                          } else {
                            setPasswordFormType("text");
                          }
                        }}
                      >
                        {passwordFormType === "password" && <FaEye />}
                        {passwordFormType === "text" && <FaEyeSlash />}
                      </div>
                    </div>
                    <FormMessage />
                    <Button
                      type="button"
                      size={"sm"}
                      variant={"link"}
                      onClick={() => {
                        setDisabledInput(true);
                        router.push("/auth/reset-password");
                      }}
                    >
                      Forgot your password?
                    </Button>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <InputOTP
                maxLength={6}
                className="w-full"
                value={twoFactorCode}
                onChange={(e) => {
                  setTwoFactorCode(e);
                }}
              >
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="w-full" />
                  <InputOTPSlot index={1} className="w-full" />
                  <InputOTPSlot index={2} className="w-full" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={3} className="w-full" />
                  <InputOTPSlot index={4} className="w-full" />
                  <InputOTPSlot index={5} className="w-full" />
                </InputOTPGroup>
              </InputOTP>
              <Button
                variant={"link"}
                size="sm"
                disabled={isActive || isPending}
                onClick={onRequestAnotherEmail}
                className="gap-2 mt-2"
                type="button"
              >
                You don&apos;t recive the email?{" "}
                {isActive ? (
                  <p className="text-sm text-foreground">
                    00:{seconds < 10 && "0"}
                    {seconds}
                  </p>
                ) : (
                  <p className="text-sm text-foreground">Request</p>
                )}
              </Button>
            </>
          )}

          <ErrorForm label={error} />
          <SuccessForm label={success} />
          <Button
            disabled={isPending || disabledInput}
            size={"lg"}
            className="w-full "
            type="submit"
          >
            {formState === "Login" ? "Login" : "Confirm"}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;
