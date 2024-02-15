import React from "react";
import { ChatOption } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import ChatTopbar from "@/components/chat/chat-topbar";
import { ChatList } from "@/components/chat/chat-list";

interface ChatProps {
  selectedChat?: ChatOption | undefined;
  userId?: string;
  chats?: ChatOption[];
}

export async function Chat() {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar>
        <UserButton />
      </ChatTopbar>
      <ChatList />
    </div>
  );
}
