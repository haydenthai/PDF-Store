import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewChatForm from "@/components/forms/newchatform";
import ChatSelect from "@/components/chat/chat-sidebar";

export function Sidebar() {
  return (
    <div className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 ">
      {
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">PDF Store</p>
          </div>

          <div>
            <div
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <SquarePen size={20}></SquarePen>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>📱Create Your Next Curated LLM🔌</DialogTitle>
                    <DialogDescription>
                      Upload a PDF and give your new GPT assistant a name.
                    </DialogDescription>
                  </DialogHeader>
                  <NewChatForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      }
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <ChatSelect />
      </nav>
    </div>
  );
}
