import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ServerDashboard from "../auth/server-dashboard";
import ClientDashboard from "../auth/client-dashboard";
import SettingsDashboard from "../auth/settings-dashboard";

function DashboardPage() {
  return (
    <div className="flex w-full h-full items-center justify-center max-h-full">
      <Tabs
        defaultValue="client"
        className="flex flex-col items-center justify-center md:w-auto"
      >
        <TabsList className="gap-x-3 ">
          <TabsTrigger value="client" className="md:px-12 px-8 rounded-md py-1">
            Client
          </TabsTrigger>
          <TabsTrigger value="server" className="md:px-12 px-8 rounded-md py-1">
            Server
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="md:px-12 px-8 rounded-md py-1"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          <ClientDashboard />
        </TabsContent>
        <TabsContent value="server">
          <ServerDashboard />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardPage;
