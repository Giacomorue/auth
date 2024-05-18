"use client";

import { ChangeIsTwoFactor, ChangeName } from "@/actions/updateSetting";
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
import { FormSchemaName, FormShcemaTwoFactor } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type FormTwoFactorSchema = z.infer<typeof FormShcemaTwoFactor>;

function IsTwoFactorForm() {
  const { data: session, update } = useSession();

  const [lastValue, setLastValue] = useState(
    session?.user.isTwoFactor ? "true" : "false"
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormTwoFactorSchema>({
    resolver: zodResolver(FormShcemaTwoFactor),
    defaultValues: {
      isTWoFactor: lastValue,
    },
  });

  const onChangeName = async (data: FormTwoFactorSchema) => {
    if (data.isTWoFactor != lastValue) {
      startTransition(() => {
        ChangeIsTwoFactor(data)
          .then(async (response) => {
            if (!response) return;
            await update();
            setLastValue(data.isTWoFactor);
            if (response.success) {
              toast.success("Is two factor changed");
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
      setLastValue(data.isTWoFactor);
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
            name="isTWoFactor"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">2FA</FormLabel>
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
                      <SelectItem value={"true"} onClick={field.onChange}>
                        Enabled
                      </SelectItem>
                      <SelectItem value={"false"} onClick={field.onChange}>
                        Disabled
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

export default IsTwoFactorForm;
