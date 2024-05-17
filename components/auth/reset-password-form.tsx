"use client";

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
import { FormSchemaResetPassword } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { RequestNewPassword } from "@/actions/resetPassword";
import { useCountdown } from "@/hook/useTimer";

type ResetPasswordFormType = z.infer<typeof FormSchemaResetPassword>;

function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [disabledInput, setDisabledInput] = useState(false);

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(FormSchemaResetPassword),
    defaultValues: {
      email: "",
    },
  });

  const onRequestNewPassword = (data: ResetPasswordFormType) => {
    startTransition(() => {
      RequestNewPassword(data)
        .then((response) => {
          if (!response) return;
          form.reset();
          setError(response.error);
          if (response.success) {
            setSuccess(
              "Email has been sent. Please check your inbox to reset your password!"
            );
            setEmail(data.email);
            setDisabledInput(true);
            start();
          }
        })
        .catch((err) => {
          setError("Something went wrong. Please try again!");
          console.log(err);
        });
    });
  };

  const { start, seconds, stop, isActive } = useCountdown({
    duration: 30, // durata del countdown in secondi
    onComplete: () => {
      stop();
    },
  });

  const onRequestAnotherEmail = () => {
    if (isActive) return;

    if(!email) return;

    const data = {
      email,
    }

    startTransition(() => {
      RequestNewPassword(data)
        .then((response) => {
          if (!response) return;
          form.reset();
          setError(response.error);
          if (response.success) {
            setSuccess(
              "New email has been sent. Please check your inbox to reset your password!"
            );
            setEmail(data.email);
            start();
          }
        })
        .catch((err) => {
          setError("Something went wrong. Please try again!");
          console.log(err);
        });
    });
  };

  return (
    <>
      {!disabledInput ? (
        <>
          {isPending && <Spinner />}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRequestNewPassword)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ErrorForm label={error} />
              <SuccessForm label={success} />
              <Button type="submit" className="w-full">
                Request reset password
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          {isPending && <Spinner />}
          <ErrorForm label={error} />
          <SuccessForm label={success} />
          {!error && (
            <Button
              variant={"link"}
              size="sm"
              disabled={isActive || isPending}
              onClick={onRequestAnotherEmail}
              className="gap-2 mt-2"
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
          )}
        </>
      )}
    </>
  );
}

export default ResetPasswordForm;
