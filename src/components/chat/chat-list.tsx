"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { type Message } from "ai";
import { useChatContext } from "@/lib/context";
import supabase from "@/lib/supabase";

export function ChatList() {
  const { selectedChat } = useChatContext();
  const [chatMessages, setChatMessages] = useState(
    selectedChat?.messages || [],
  );
  const vercelChatOptions = {
    body: {
      conversationId: selectedChat?.id,
    },
    initialMessages: selectedChat?.messages || [],
    onFinish: async (message: Message) => {
      const newMessagesWithGPTResponse = JSON.stringify([
        ...chatMessages,
        { role: "user", content: input },
        { role: message.role, content: message.content },
      ]);

      await supabase
        .from("conversations")
        .update({
          messages: newMessagesWithGPTResponse,
          last_updated: new Date().toISOString(),
        })
        .eq("id", selectedChat?.id);

      setChatMessages([
        ...chatMessages,
        { role: message.role, content: message.content },
      ]);
    },
  };
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } =
    useChat(vercelChatOptions);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    // console.log(messages);
    setChatMessages(messages);
  }, [messages]);

  if (!selectedChat || selectedChat?.title === "") {
    return null;
  }

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => {
            if (message.role === "system") {
              return null;
            }
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: messages.indexOf(message) * 0.05 + 0.2,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn(
                  "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                  message.role !== "assistant" ? "items-end" : "items-start",
                )}
              >
                <div className="flex gap-3 items-center">
                  <span className=" bg-accent p-3 rounded-md max-w-xs whitespace-pre-wrap">
                    {message.content}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {!!selectedChat && (
        <form
          onSubmit={handleSubmit}
          className="p-2 flex justify-between w-full items-center gap-2"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key="input"
              className="w-full relative"
              layout
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 0.05 },
                layout: {
                  type: "spring",
                  bounce: 0.15,
                },
              }}
            >
              <Input
                autoComplete="off"
                value={input}
                onChange={handleInputChange}
                name="message"
                placeholder="Aa"
                className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
              />
            </motion.div>

            <button
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0",
              )}
              type="submit"
            >
              <SendHorizontal size={20} className="text-muted-foreground" />
            </button>
          </AnimatePresence>
        </form>
      )}
    </div>
  );
}
