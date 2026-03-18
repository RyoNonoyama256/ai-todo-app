export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

export const todoApi = {
  list: (): Promise<Todo[]> =>
    fetch("/api/todos").then((r) => r.json()),

  create: (text: string): Promise<Todo> =>
    fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  update: (id: number, data: { text?: string; completed?: boolean }): Promise<Todo> =>
    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id: number): Promise<void> =>
    fetch(`/api/todos/${id}`, { method: "DELETE" }).then(() => undefined),

  deleteCompleted: (): Promise<void> =>
    fetch("/api/todos?completed=true", { method: "DELETE" }).then(() => undefined),
};
