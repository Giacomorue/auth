"use client";

import React from "react";
import CardWrapper from "../auth-wrapper";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

function ClientDashboard() {
  const { data: session } = useSession();

  return (
    <div className="w-full flex flex-row items-center justify-center mt-5 max-h-full overflow-y-auto">
      <CardWrapper title="Client">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <div className="font-medium">Credentials</div>
            <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
              {session?.user.isCredentials ? "Yes" : "No"}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="font-medium">Database Id</div>
            <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
              {session?.user.id}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="font-medium">Name</div>
            <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
              {session?.user.name}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="font-medium">Email</div>
            <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
              {session?.user.email}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="font-medium">Role</div>
            <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
              {session?.user.role}
            </div>
          </div>
          {session?.user.isCredentials && (
            <div className="flex flex-row justify-between items-center">
              <div className="font-medium">2FA</div>
              <div className="px-2 py-1 bg-muted rounded-sm text-muted-foreground max-w-[200px] truncate">
                {session?.user.isTwoFactor ? "Enabled" : "Disabled"}
              </div>
            </div>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}

export default ClientDashboard;
