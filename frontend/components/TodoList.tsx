'use client';

import { Todo, UpdateTodoPayload } from '../lib/api';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, payload: UpdateTodoPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

export default function TodoList({ todos, onUpdate, onDelete, isLoading }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-10 text-center color-[#999] text-[15px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <p>Loading todos...</p>
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center text-[#999] text-[15px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <p>No todos yet. Add one above! 🎉</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {pending.length > 0 && (
        <section>
          <h3 className="text-[14px] font-semibold text-[#666] mb-[10px] uppercase tracking-[0.05em]">Pending ({pending.length})</h3>
          <div className="flex flex-col gap-[10px]">
            {pending.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section className="mt-6">
          <h3 className="text-[14px] font-semibold text-[#666] mb-[10px] uppercase tracking-[0.05em]">Completed ({completed.length})</h3>
          <div className="flex flex-col gap-[10px]">
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
