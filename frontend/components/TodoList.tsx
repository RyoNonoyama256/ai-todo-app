"use client";

import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "done";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Figma MCP を Claude Code に設定する", completed: true },
    { id: "2", text: "Todo コンポーネントを作成する", completed: false },
    { id: "3", text: "Vercel にデプロイする", completed: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString("ja-JP", { weekday: "long", month: "long", day: "numeric" }));
  }, []);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-500 mb-1">
          {dateLabel}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          今日のタスク
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {remaining} 件残っています
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="新しいタスクを追加..."
          className="flex-1 text-[15px] bg-gray-100 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <button
          onClick={addTodo}
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#ff2b2f] hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center"
          aria-label="タスクを追加"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {(["all", "active", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-all ${
              filter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            タスクがありません
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                {...todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {todos.some((t) => t.completed) && (
        <button
          onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
          className="mt-4 w-full text-sm text-gray-400 hover:text-red-400 transition-colors py-2"
        >
          完了済みを削除
        </button>
      )}
    </div>
  );
}
