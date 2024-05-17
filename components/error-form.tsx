import { TriangleAlertIcon } from "lucide-react";
import React from "react";

function ErrorForm({ label }: { label?: string }) {
  if (!label) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-destructive text-destructive-foreground flex flex-row items-center gap-2">
      <TriangleAlertIcon />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default ErrorForm;
