import AiAssistant from "@/components/AiAssistant";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-start justify-center px-4 pt-4 pb-16"
      style={{ background: "linear-gradient(144.53deg, #f8fafc 0%, #f9fafb 50%, #fafaf9 100%)" }}
    >
      <div className="flex gap-4 w-full max-w-[1071px]">
        <AiAssistant />
        <TodoList />
      </div>
    </main>
  );
}
