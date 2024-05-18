"use client";

import {
  ChangeIsTwoFactor,
  ChangeName,
  ChangeRole,
} from "@/actions/updateSetting";
import Spinner from "@/components/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormSchemaName, FormSchemaRole, FormShcemaTwoFactor } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type FormRoleSchema = z.infer<typeof FormSchemaRole>;

function RoleForm() {
  const { data: session, update } = useSession();

  const [lastValue, setLastValue] = useState<"USER" | "ADMIN">(
    session?.user.role === "ADMIN" ? "ADMIN" : "USER"
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormRoleSchema>({
    resolver: zodResolver(FormSchemaRole),
    defaultValues: {
      role: lastValue,
    },
  });

  const onChangeName = async (data: FormRoleSchema) => {
    if (data.role != lastValue) {
      startTransition(() => {
        ChangeRole(data)
          .then(async (response) => {
            if (!response) return;
            await update();
            setLastValue(data.role === "ADMIN" ? "ADMIN" : "USER");
            if (response.success) {
              toast.success("Role changed");
              window.location.reload();
            }
            if (response.error) {
              toast.error(response.error);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error changing name");
            return;
          });
      });
      setLastValue(data.role === "ADMIN" ? "ADMIN" : "USER");
    }
  };

  return (
    <>
      {isPending && <Spinner />}
      <Form {...form}>
        <form
          onBlur={form.handleSubmit(onChangeName)}
          onSubmit={form.handleSubmit(onChangeName)}
          className="pt-3"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Role</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"2FA"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"USER"} onClick={field.onChange}>
                        User
                      </SelectItem>
                      <SelectItem value={"ADMIN"} onClick={field.onChange}>
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

export default RoleForm;
