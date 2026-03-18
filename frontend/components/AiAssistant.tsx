"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiAssistant({ onAction }: { onAction?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "こんにちは！タスク管理をお手伝いします。例えば「明日の会議の準備タスクを追加して」や「完了したタスクを削除して」などと話しかけてください。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // API に渡すのは初回の挨拶メッセージ（assistant）を除いた会話履歴
      const apiMessages = newMessages
        .filter((m) => !(m.role === "assistant" && messages.indexOf(m) === 0))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      onAction?.();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/80 border border-white/20 rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-[409px] shrink-0 flex flex-col overflow-hidden h-[731px]">
      {/* Header */}
      <div
        className="h-24 px-6 pt-6 flex items-center gap-3 shrink-0"
        style={{ background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C10.3 4.8 12.5 8 18 10C12.5 12 10.3 15.2 10 18C9.7 15.2 7.5 12 2 10C7.5 8 9.7 4.8 10 2Z" fill="white" />
            <path d="M4 3C4.1 4 5 5.5 7 6C5 6.5 4.1 8 4 9C3.9 8 3 6.5 1 6C3 5.5 3.9 4 4 3Z" fill="white" opacity="0.7" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-[20px] leading-7 tracking-[-0.45px]">AI アシスタント</p>
          <p className="text-[#e2e8f0] text-[14px] leading-5">タスク管理をサポートします</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 px-6 pt-6 pb-2 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C10.3 4.8 12.5 8 18 10C12.5 12 10.3 15.2 10 18C9.7 15.2 7.5 12 2 10C7.5 8 9.7 4.8 10 2Z" fill="white" />
                </svg>
              </div>
            )}
            <div
              className={`rounded-2xl px-3 py-3 max-w-[270px] text-[15px] leading-6 whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-[#f1f5f9] text-[#1e2939]"
                  : "text-white"
              }`}
              style={
                msg.role === "user"
                  ? { background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }
                  : undefined
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C10.3 4.8 12.5 8 18 10C12.5 12 10.3 15.2 10 18C9.7 15.2 7.5 12 2 10C7.5 8 9.7 4.8 10 2Z" fill="white" />
              </svg>
            </div>
            <div className="bg-[#f1f5f9] rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-[#94a3b8] animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-[#94a3b8] animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-[#94a3b8] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-4 pt-4 pb-4 flex flex-col gap-2 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="AIに指示を送る..."
            disabled={loading}
            className="flex-1 bg-white border border-[#e2e8f0] rounded-[14px] px-4 py-3 text-[16px] text-gray-800 placeholder-[#99a1af] outline-none focus:ring-2 focus:ring-[#45556c] transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-[68px] h-[50px] rounded-[14px] flex items-center justify-center shrink-0 active:scale-95 transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }}
            aria-label="送信"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 17L17 10L3 3V8.5L13 10L3 11.5V17Z" fill="white" />
            </svg>
          </button>
        </div>
        <p className="text-[#6a7282] text-[12px] leading-4">
          例: 「会議の準備を追加して」「完了済みを削除して」
        </p>
      </div>
    </div>
  );
}
