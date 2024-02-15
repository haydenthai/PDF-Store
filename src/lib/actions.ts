"use server";
import { revalidatePath } from "next/cache";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

export type FormState = {
  data?: string;
  errors: {
    text: string | undefined;
  };
};

export async function createChatAction(
  previousState: FormState,
  formData: FormData,
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        text: undefined,
        errors: {
          text: "Not authenticated",
        },
      };
    }

    const name = formData.get("name") as string;
    const pdf = formData.get("file") as Blob;

    if (!name || !pdf) {
      return {
        data: undefined,
        errors: {
          text: "Name and file must be defined",
        },
      };
    }

    if (!!pdf) {
      const loader = new PDFLoader(pdf);
      const docs = await loader.load();

      const pages = docs.map((doc) => doc.pageContent);
      const metadata = docs.map((doc) => doc.metadata);

      console.log(
        "====================\nCREATING VECTORSTORE \n====================\n",
      );

      const vstore = await SupabaseVectorStore.fromTexts(
        pages,
        metadata,
        new OpenAIEmbeddings(),
        {
          client: supabase,
          tableName: "documents",
          queryName: "match_documents",
        },
      );

      if (!vstore) {
        console.error("Error creating vectorstore");
        return {
          data: undefined,
          errors: {
            text: "Something went wrong",
          },
        };
      }

      console.log(
        "====================\nVECTOR STORE CREATED SUCCESSFULLY \n====================\n",
      );
    }

    const { error: conversationError } = await supabase
      .from("conversations")
      .insert([
        {
          title: name,
          user_id: userId,
          messages: JSON.stringify([]),
        },
      ]);
    if (conversationError) {
      console.error(conversationError);
      return {
        data: undefined,
        errors: {
          text: "Something went wrong",
        },
      };
    }
    revalidatePath("/");
    return {
      data: "Successfully created your new GPT",
      errors: {
        text: undefined,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      data: undefined,
      errors: {
        text: "Something went wrong",
      },
    };
  }
}

export async function getChats() {
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        data: undefined,
        errors: {
          text: "Not authenticated",
        },
      };
    }

    const { data: rawData, error } = await supabase
      .from("conversations")
      .select("id, title, messages") // Adjust this as needed to fetch specific columns
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching conversations:");
      console.error(error);

      return {
        data: undefined,
        errors: {
          text: "Something went wrong",
        },
      };
    }

    const data = rawData?.map((conversation) => {
      return {
        id: conversation.id,
        title: conversation.title,
        messages: JSON.parse(conversation.messages),
      };
    });

    revalidatePath("/");
    if (!data || data.length === 0) {
      return {
        data: [],
        errors: {
          text: undefined,
        },
      };
    }

    return {
      data: data,
      errors: {
        text: undefined,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      data: undefined,
      errors: {
        text: "Something went wrong",
      },
    };
  }
}

const niceTableNames = (s: string) => {
  return s.replace(/_/g, " ").replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};
const BackendTableName = (s: string) => {
  return s.replace(/ /g, "_").toLowerCase();
};
