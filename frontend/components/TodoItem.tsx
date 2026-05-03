'use client';

import { useState } from 'react';
import { Todo, UpdateTodoPayload } from '../lib/api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, payload: UpdateTodoPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${todo.title}"?`)) return;
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-[10px] p-4 flex items-start gap-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all border-[1.5px] border-transparent hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:border-[#e0e0e0] ${todo.completed ? 'opacity-[0.55]' : ''}`}>
      <div className="shrink-0 pt-0.5">
        <button
          className={`w-[22px] h-[22px] rounded-md border-2 bg-white flex items-center justify-center text-[12px] text-white transition-all hover:border-[#4f46e5] ${todo.completed ? 'bg-[#4f46e5] border-[#4f46e5]' : 'border-[#d0d0d0]'}`}
          onClick={handleToggleComplete}
          disabled={isUpdating || isDeleting}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && '✓'}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium mb-1 break-words ${todo.completed ? 'line-through text-[#888]' : 'text-[#1a1a1a]'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-[13px] text-[#666] mb-1 break-words">{todo.description}</p>
        )}
        <p className="text-[11px] text-[#aaa]">Created: {formatDate(todo.created_at)}</p>
      </div>
      <div className="shrink-0">
        <button
          className="bg-transparent border-none text-[16px] px-1.5 py-1 rounded-md transition-colors opacity-50 hover:bg-[#fee2e2] hover:opacity-100 disabled:cursor-not-allowed"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          aria-label="Delete todo"
        >
          {isDeleting ? '...' : '🗑'}
        </button>
      </div>
    </div>
  );
}
