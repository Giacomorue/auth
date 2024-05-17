import { TriangleAlertIcon } from "lucide-react";
import React from "react";

function SuccessForm({ label }: { label?: string }) {
  if (!label) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-emerald-500 text-white flex flex-row items-center gap-2 font-semibold">
      <TriangleAlertIcon />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default SuccessForm;
