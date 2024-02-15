"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ChatOption } from "@/lib/types";

interface ChatContextType {
  userId: string | null;
  selectedChat: ChatOption | null;
  setSelectedChat: Dispatch<SetStateAction<ChatOption | null>>;
  setUserId: Dispatch<SetStateAction<string | null>>;
  chats: ChatOption[];
  setChats: Dispatch<SetStateAction<ChatOption[]>>;
  createDocsLoading: boolean;
  setCreateDocsLoading: Dispatch<SetStateAction<boolean>>;
}

const defaultValues: ChatContextType = {
  userId: null,
  selectedChat: null,
  setSelectedChat: () => {},
  setUserId: () => {},
  chats: [],
  setChats: () => {},
  createDocsLoading: true,
  setCreateDocsLoading: () => {},
};

export const ChatContext = createContext<ChatContextType>(defaultValues);

export default function AppContext({ children }: { children: ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<ChatOption | null>({
    id: "",
    title: "",
    messages: [],
  });
  const [userId, setUserId] = useState<string | null>("");
  const [chats, setChats] = useState<ChatOption[]>([]);
  const [createDocsLoading, setCreateDocsLoading] = useState(true);

  const values: ChatContextType = {
    userId,
    selectedChat,
    setSelectedChat,
    setUserId,
    chats,
    setChats,
    createDocsLoading,
    setCreateDocsLoading,
  };

  // useEffect(() => {
  //   setSelectedChat(chats[0]);
  // }, [chats]);

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  return useContext(ChatContext);
}
