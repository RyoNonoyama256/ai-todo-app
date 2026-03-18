"use client";

import { useState } from "react";
import AiAssistant from "@/components/AiAssistant";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main
      className="min-h-screen flex items-start justify-center px-4 pt-4 pb-16"
      style={{ background: "linear-gradient(144.53deg, #f8fafc 0%, #f9fafb 50%, #fafaf9 100%)" }}
    >
      <div className="flex gap-4 w-full max-w-[1071px]">
        <AiAssistant onAction={() => setRefreshKey((k) => k + 1)} />
        <TodoList refreshKey={refreshKey} />
      </div>
    </main>
  );
}
