import { cookies } from "next/headers";
import { getChats } from "@/lib/actions";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Chat } from "@/components/chat/chat";
import { unstable_noStore } from "next/cache";

export default async function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const chats = await getChats();
  unstable_noStore();

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 md:px-24 py-12 gap-4">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ChatLayout
          chats={chats?.data}
          defaultLayout={defaultLayout}
          navCollapsedSize={8}
        >
          <Chat />
        </ChatLayout>
      </div>

      <div className="flex justify-between max-w-5xl w-full items-start text-xs md:text-sm text-muted-foreground ">
        <p className="max-w-[150px] sm:max-w-lg">
          Built by{" "}
          <a
            className="font-semibold"
            href="https://www.linkedin.com/in/haydenthai/"
          >
            Hayden Thai
          </a>
        </p>
      </div>
    </main>
  );
}
