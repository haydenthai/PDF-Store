"use client";
import { useChatContext } from "@/lib/context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect } from "react";

export default function ChatSelectSkeleton() {
  const { createDocsLoading } = useChatContext();

  useEffect(() => {
    console.log("createDocsLoading updating");
    console.log(createDocsLoading);
  }, [createDocsLoading]);

  if (!createDocsLoading) {
    return null;
  }
  return (
    <div className="mb-3">
      <Skeleton
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "xl",
          }),
          "h-14 w-full rounded-xl",
        )}
      >
        <Skeleton className={cn("h-4 w-full")} />
      </Skeleton>
    </div>
  );
}
