"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useFormState } from "react-dom";
import { createChatAction, FormState } from "@/lib/actions";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useChatContext } from "@/lib/context";

export default function NewChatForm() {
  const [formState, wrappedCreateTodoAction] = useFormState(createChatAction, {
    data: undefined,
    errors: {
      text: undefined,
    },
  } as FormState);
  const { toast } = useToast();

  const { createDocsLoading, setCreateDocsLoading } = useChatContext();

  useEffect(() => {
    if (!!formState?.data) {
      toast({ description: "Chat created successfully", title: "success" });
    } else if (!!formState?.errors?.text) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: formState?.errors?.text,
      });
    }
    setCreateDocsLoading(false);
  }, [formState]);

  return (
    <>
      <form action={wrappedCreateTodoAction} className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" name="name" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file" className="text-right">
            File
          </Label>
          <Input
            name="file"
            id="file"
            type="file"
            className="col-span-3 z-50"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              // disabled={createDocsLoading}
              onClick={() => setCreateDocsLoading(true)}
              type="submit"
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </>
  );
}
