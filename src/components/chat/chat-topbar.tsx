"use client";
import React from "react";
import { useChatContext } from "@/lib/context";
import { UserButton } from "@clerk/nextjs";

interface ChatTopbarProps {
  children?: React.ReactNode;
}

export default function ChatTopbar({ children }: ChatTopbarProps) {
  const { selectedChat } = useChatContext();
  let title = selectedChat?.title ? selectedChat.title + " Assistant" : "";

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
        </div>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}
