"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/lib/context";

export default function ChatSelect() {
  const { chats, selectedChat, setSelectedChat, createDocsLoading } =
    useChatContext();

  return (
    <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
      {/*<ChatSelectSkeleton />*/}
      {chats.map((c, index) => (
        <Button
          key={index}
          className={cn(
            buttonVariants({
              variant: c.title === selectedChat?.title ? "default" : "grey",
              size: "xl",
            }),
            "grey dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
            "justify-start gap-4",
          )}
          onClick={() => {
            setSelectedChat(c);
          }}
        >
          <div className={"flex flex-col max-w-28"}>
            <span>{c.title}</span>
          </div>
        </Button>
      ))}
    </nav>
  );
}
