import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, FunctionDeclaration } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

const SYSTEM_PROMPT =
  "あなたはTodo管理AIアシスタントです。ユーザーの指示に従い、提供されたツールを使ってTodoを操作してください。操作後は結果を日本語でわかりやすく伝えてください。";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const transport = new StdioClientTransport({
    command: "docker",
    args: ["exec", "-i", "ai-todo-app-backend-1", "python3", "/app/mcp_server.py"],
  });

  const mcpClient = new Client(
    { name: "todo-chat-client", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    await mcpClient.connect(transport);
    // MCP サーバーからツール一覧を取得して Gemini 形式に変換
    const { tools: mcpTools } = await mcpClient.listTools();
    const functionDeclarations: FunctionDeclaration[] = mcpTools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? "",
      parameters: tool.inputSchema as FunctionDeclaration["parameters"],
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations }],
    });

    // messages の末尾以外を history に、末尾をユーザー発言として送信
    // Gemini のロールは "user" / "model"（"assistant" ではない）
    const history = messages.slice(0, -1).filter((m: { role: string; content: string }) => m.content).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    let result = await chat.sendMessage(lastMessage.content);

    // エージェントループ: ツール呼び出しがなくなるまで繰り返す
    while (true) {
      const functionCalls = result.response.functionCalls();
      console.log("[chat] functionCalls:", JSON.stringify(functionCalls));
      if (!functionCalls || functionCalls.length === 0) break;

      const toolResults = await Promise.all(
        functionCalls.map(async (fc) => {
          const mcpResult = await mcpClient.callTool({
            name: fc.name,
            arguments: fc.args as Record<string, unknown>,
          }) as { content: { type: string; text?: string }[] };
          const first = mcpResult.content[0];
          const content = first?.type === "text" && first.text
            ? first.text
            : JSON.stringify(mcpResult.content);
          console.log("[chat] tool result:", fc.name, content);
          return {
            functionResponse: {
              name: fc.name,
              response: { result: content },
            },
          };
        })
      );

      result = await chat.sendMessage(toolResults);
    }

    return NextResponse.json({ message: result.response.text() });
  } catch (e) {
    console.error("[chat] error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  } finally {
    await mcpClient.close();
  }
}
