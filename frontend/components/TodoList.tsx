"use client";

import { useState, useEffect } from "react";
import { todoApi, Todo } from "@/lib/api";
import TodoItem from "./TodoItem";

type Filter = "all" | "active" | "done";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString("ja-JP", { weekday: "long", month: "long", day: "numeric" }));
    todoApi.list().then(setTodos);
  }, []);

  const addTodo = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const created = await todoApi.create(trimmed);
    setTodos((prev) => [...prev, created]);
    setInput("");
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = await todoApi.update(id, { completed: !todo.completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id: number) => {
    await todoApi.delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = async () => {
    await todoApi.deleteCompleted();
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  const filterLabels: Record<Filter, string> = { all: "ALL", active: "未完了", done: "完了" };

  return (
    <div className="flex-1 bg-white/80 border border-white/20 rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden h-[731px] flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <p className="text-[#717182] text-[14px] leading-5 text-center tracking-[-0.15px]">
            {dateLabel}
          </p>
          <h1
            className="text-[36px] font-bold leading-10 text-center tracking-[0.37px] bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #314158 0%, #1e2939 50%, #314158 100%)" }}
          >
            TODO
          </h1>
          <p className="text-[#717182] text-[16px] leading-6 text-center tracking-[-0.31px]">
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
            placeholder="手動でタスクを追加..."
            className="flex-1 bg-white/50 border border-[#e5e7eb] rounded-[14px] px-4 py-3 text-[16px] text-gray-800 placeholder-[#99a1af] outline-none focus:ring-2 focus:ring-[#45556c] focus:bg-white transition-all"
          />
          <button
            onClick={addTodo}
            className="w-[68px] h-[50px] rounded-[14px] flex items-center justify-center shrink-0 active:scale-95 transition-all"
            style={{ background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" }}
            aria-label="タスクを追加"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 justify-center">
          {(["all", "active", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-[42px] px-5 rounded-full text-[16px] font-medium tracking-[-0.31px] transition-all ${
                filter === f
                  ? "text-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                  : "bg-white/60 border border-[#e5e7eb] text-[#4a5565] hover:bg-white"
              }`}
              style={filter === f ? { background: "linear-gradient(90deg, #45556c 0%, #314158 100%)" } : {}}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <div className="flex flex-col gap-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              タスクがありません
            </div>
          ) : (
            filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                {...todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {/* Clear completed */}
      {todos.some((t) => t.completed) && (
        <div className="px-6 pb-6 flex justify-center shrink-0">
          <button
            onClick={clearCompleted}
            className="h-[50px] px-8 bg-white/60 border border-[#e5e7eb] rounded-full flex items-center gap-2 text-[16px] font-medium text-[#4a5565] hover:bg-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5 4V2.5h6V4M3.5 4l1 9h7l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            完了済みを削除
          </button>
        </div>
      )}
    </div>
  );
}
