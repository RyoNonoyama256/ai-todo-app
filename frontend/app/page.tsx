import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-20 pb-16">
      <TodoList />
    </main>
  );
}
