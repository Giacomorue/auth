"use client";

import { FormSchemaRegister, FormSchemaVerifyOtp } from "@/schemas";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "../spinner";
import { Register } from "@/actions/register";
import ErrorForm from "../error-form";
import SuccessForm from "../success-form";
import { RequestVerifyEmailLink } from "@/actions/requestVerifyEmailLink";
import { useCountdown } from "@/hook/useTimer";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type RegisterFormType = z.infer<typeof FormSchemaRegister>;

function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [passwordFormType, setPasswordFormType] = useState<"password" | "text">(
    "password"
  );

  const formRegister = useForm<RegisterFormType>({
    resolver: zodResolver(FormSchemaRegister),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmitRegister = (data: RegisterFormType) => {
    startTransition(() => {
      Register(data)
        .then((response) => {
          formRegister.reset();
          if (!response) return;
          setError(response.error);

          if (response.success && response.user) {
            setSuccess(
              "Email has been sent. Please check your inbox to verify your email address!"
            );
            setUserId(response.user.id);
            start();
          }

          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const onRequestAnotherEmail = () => {
    console.log("Request another email");

    if (!userId) return;

    if (isActive) return;

    startTransition(() => {
      RequestVerifyEmailLink(userId)
        .then((response) => {
          if (!response) return;
          setError(response.error);

          if (response.dbToken) {
            setSuccess("New email has been sent!");
            start();
          }
          else{
            setSuccess("");
          }

          

          console.log(response);
        })
        .catch((err) => {
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
      {!userId ? (
        <Form {...formRegister}>
          <form
            onSubmit={formRegister.handleSubmit(onSubmitRegister)}
            className="space-y-2"
          >
            <FormField
              control={formRegister.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formRegister.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formRegister.control}
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
                      className="absolute right-3 p-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer" onClick={() => {
                        if(passwordFormType === "text"){
                          setPasswordFormType("password")
                        }
                        else{
                          setPasswordFormType("text");
                        }
                      }}
                    >
                      {passwordFormType === "password" && <FaEye />}
                      {passwordFormType === "text" && <FaEyeSlash />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ErrorForm label={error} />

            <Button
              disabled={isPending}
              size={"lg"}
              className="w-full "
              type="submit"
            >
              Register
            </Button>
          </form>
        </Form>
      ) : (
        <>
          {isPending && <Spinner />}
          <ErrorForm label={error} />
          <SuccessForm label={success} />
          {!error && <Button
            variant={"link"}
            size="sm"
            disabled={isActive || isPending}
            onClick={onRequestAnotherEmail}
            className="gap-2 mt-2"
          >
            You don&apos;t recive the email?{" "}
            {isActive ? (
              <p className="text-sm text-foreground">00:{seconds < 10 && "0"}{seconds}</p>
            ) : (
              <p className="text-sm text-foreground">Request</p>
            )}
          </Button>}
        </>
      )}
    </>
  );
}

export default RegisterForm;
