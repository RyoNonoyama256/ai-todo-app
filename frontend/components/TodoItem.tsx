"use client";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group bg-white/80 border border-white/20 rounded-[14px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] px-[17px] py-[17px] flex items-center gap-3 relative">
      <button
        onClick={() => onToggle(id)}
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        style={
          completed
            ? { background: "linear-gradient(90deg, #45556c 0%, #314158 100%)", borderColor: "transparent" }
            : { borderColor: "#d1d5dc" }
        }
        aria-label={completed ? "未完了にする" : "完了にする"}
      >
        {completed && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-[16px] leading-6 tracking-[-0.31px] transition-colors ${
          completed ? "line-through text-[#99a1af]" : "text-[#1e2939]"
        }`}
      >
        {text}
      </span>

      <button
        onClick={() => onDelete(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400 p-1 rounded-lg absolute right-3"
        aria-label="削除"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
