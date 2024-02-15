import { OpenAIStream, StreamingTextResponse } from "ai";
import endent from "endent";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "edge";

/**
 * This function handles POST requests to the chat API.
 * It processes the request, generates a response using OpenAI, and updates the conversation in the database.
 * @async
 * @function
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<StreamingTextResponse|NextResponse>} - The response object.
 */
export async function POST(
  req: NextRequest,
): Promise<StreamingTextResponse | NextResponse> {
  try {
    const data = await req.json();

    console.log("===================== POSTED data ======================");
    console.log(data);
    console.log("===================== POSTED data ======================");

    const { messages, conversationId } = data;
    if (!conversationId) {
      return NextResponse.error();
    }

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const vectorstore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents",
      },
    );

    const similarChunk = await vectorstore.similaritySearch(
      messages[messages.length - 1].content,
      1,
    );

    const lastUserMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: shortenString(
        messages[messages.length - 1].content +
          " " +
          JSON.stringify(similarChunk[0].pageContent),
      ),
    };

    let finalMessages: ChatCompletionRequestMessage[] = [];
    if (messages.length === 1) {
      const retriever = vectorstore.asRetriever(1);

      const pages = await retriever.getRelevantDocuments(
        messages[messages.length - 1].content,
      );

      const systemMessage = {
        role: "system",
        content: endent`
    You are an expert on the following document.

    You will be given a question will answer it based on the following pages of the documents below:
    
    When you answer be as concise as possible, do not ramble. Answer in a casual, easygoing tone and avoid using corporate jargon.
    Be as concise as possible and avoid use of adjectives or adverbs.

    ${pages.map((page) => page.pageContent).join("\n\n")}`,
      };

      finalMessages = [systemMessage, ...messages];
    } else {
      finalMessages = messages;
    }

    await supabase
      .from("conversations")
      .update({
        messages: finalMessages,
        last_updated: new Date().toISOString(),
      })
      .eq("id", conversationId);

    let openAiConvo: ChatCompletionRequestMessage[] = [];
    if (finalMessages.length == 1) {
      openAiConvo = finalMessages;
    } else {
      openAiConvo = [
        ...finalMessages.slice(0, finalMessages.length - 1),
        lastUserMessage,
      ];
    }

    console.log(openAiConvo);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      stream: true,
      messages: openAiConvo,
      max_tokens: 400,
    });

    const stream = OpenAIStream(response);
    revalidatePath("/");
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error("===================================");
    console.error("Error in chat route: POST /api/chat/route.ts");
    console.error("-----------------------------------");
    console.error(e);
    console.error("===================================");
    return NextResponse.error();
  }
}

//shorten a string by approximately 20%
//todo: find a better way to avoid exceeding 4000 tokens
function shortenString(str: string, targetReductionPercent = 20) {
  const targetLength =
    str.length - Math.floor((str.length * targetReductionPercent) / 100);
  return str.slice(0, targetLength);
}
