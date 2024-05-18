"use client";

import { DeleteAccount } from "@/actions/updateSetting";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React, { useTransition } from "react";
import { toast } from "sonner";

function DeleteAccountBtn() {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(() => {
      DeleteAccount().then(async (res) => {
        if (!res) return;
        if (res.success) {
          await signOut();
        } else {
          if (res.error) {
            toast.error(res.error);
          }
        }
      });
    });
  };

  return (
    <>
      {isPending && <Spinner />}
      <Button className="w-full mt-5" variant="destructive" onClick={onDelete}>
        Delte account
      </Button>
    </>
  );
}

export default DeleteAccountBtn;
