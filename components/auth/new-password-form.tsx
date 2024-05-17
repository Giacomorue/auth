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
import { FormSchemaNewPassword, FormSchemaResetPassword } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ChangePassword, CheckNewPasswordToken } from "@/actions/newPassword";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type NewPasswordFormType = z.infer<typeof FormSchemaNewPassword>;

function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [disabledInput, setDisabledInput] = useState(false);

  const [passwordFormType, setPasswordFormType] = useState<"password" | "text">(
    "password"
  );
  const [confirmPasswordFormType, setConfirmPasswordFormType] = useState<
    "password" | "text"
  >("password");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    startTransition(() => {
      if (success || error) return;

      if (!token) {
        setError("Token not valid");
        setDisabledInput(true);
        return;
      }

      CheckNewPasswordToken(token)
        .then((response) => {
          if (!response) return;
          if (response.error) {
            setSuccess(undefined);
            setError("Token not valid");
            setDisabledInput(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setError("Token not valid");
          setDisabledInput(true);
          setSuccess(undefined);
        });
    });
  }, [token]);

  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(FormSchemaNewPassword),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = (data: NewPasswordFormType) => {
    startTransition(() => {
      if (!token) {
        setError("Token not valid");
        setDisabledInput(true);
        return;
      }

      ChangePassword(token, data)
        .then((response) => {
          if (!response) return;

          if (response.error) {
            setError(response.error);
            setDisabledInput(true);
            setSuccess(undefined);
            return;
          }

          if (response.success) {
            setSuccess(response.success);
            setDisabledInput(true);
            setError(undefined);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          setError("Something went wrong. Please try later!");
          setDisabledInput(true);
          setSuccess(undefined);
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
              onSubmit={form.handleSubmit(onChangePassword)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={confirmPasswordFormType}
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div
                        className="absolute right-3 p-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer"
                        onClick={() => {
                          if (confirmPasswordFormType === "text") {
                            setConfirmPasswordFormType("password");
                          } else {
                            setConfirmPasswordFormType("text");
                          }
                        }}
                      >
                        {confirmPasswordFormType === "password" && <FaEye />}
                        {confirmPasswordFormType === "text" && <FaEyeSlash />}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                Change Password
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          {isPending && <Spinner />}
          <ErrorForm label={error} />
          <SuccessForm label={success} />
          <Separator className="my-3" />
          <Button className="w-full" asChild>
            <Link href={"/auth/login"}>Back to login</Link>
          </Button>
        </>
      )}
    </>
  );
}

export default NewPasswordForm;
