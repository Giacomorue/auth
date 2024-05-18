import React from "react";
import CardWrapper from "../auth-wrapper";
import NameForm from "./SettingsForm/NameForm";
import { auth } from "@/auth";
import IsTwoFactorForm from "./SettingsForm/TwoFactorForm";
import RoleForm from "./SettingsForm/RoleForm";
import DeleteAccountBtn from "./SettingsForm/DeleteAccountBtn";

async function SettingsDashboard() {
  const session = await auth();
  return (
    <div className="w-full flex flex-row items-center justify-center mt-5 max-h-full overflow-y-auto">
      <CardWrapper title="Settings">
        <div className="">
          {session?.user.isCredentials && <NameForm />}
          {session?.user.isCredentials && <IsTwoFactorForm />}
          <RoleForm />
          <DeleteAccountBtn />
        </div>
      </CardWrapper>
    </div>
  );
}

export default SettingsDashboard;
