import React from "react";
import { cn } from "@repo/ui/lib/utils";

export function Dashboard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      Dashboard
    </div>
  );
}
