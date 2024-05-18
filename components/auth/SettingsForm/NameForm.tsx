"use client";

import { ChangeName } from "@/actions/updateSetting";
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
import { FormSchemaName } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export type FormNameType = z.infer<typeof FormSchemaName>;

function NameForm() {
  const { data: session, update } = useSession();

  const [lastValue, setLastValue] = useState(session?.user.name || "");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormNameType>({
    resolver: zodResolver(FormSchemaName),
    defaultValues: {
      name: lastValue,
    },
  });

  const onChangeName = async (data: FormNameType) => {
    if (data.name != lastValue) {
      startTransition(() => {
        ChangeName(data)
          .then(async (response) => {
            if (!response) return;
            await update();
            setLastValue(data.name);
            if(response.success){
                toast.success("Name changed");
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
      setLastValue(data.name);
    }
  };

  return (
    <>
      {isPending && <Spinner />}
      <Form {...form}>
        <form
          onBlur={form.handleSubmit(onChangeName)}
          onSubmit={form.handleSubmit(onChangeName)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
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

export default NameForm;
