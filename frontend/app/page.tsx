'use client';

import { useEffect, useState, useCallback } from 'react';
import { todoApi, Todo, CreateTodoPayload, UpdateTodoPayload } from '../lib/api';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // ─── Fetch all todos ─────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    setIsLoadingList(true);
    setFetchError('');
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err: any) {
      setFetchError('Failed to load todos. Is the backend running?');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ─── Create ──────────────────────────────────────────────────────
  const handleCreate = async (payload: CreateTodoPayload) => {
    setIsCreating(true);
    try {
      const newTodo = await todoApi.create(payload);
      setTodos((prev) => [newTodo, ...prev]);
    } finally {
      setIsCreating(false);
    }
  };

  // ─── Update ──────────────────────────────────────────────────────
  const handleUpdate = async (id: number, payload: UpdateTodoPayload) => {
    const updated = await todoApi.update(id, payload);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // ─── Delete ──────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    await todoApi.delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7ff] to-[#f0f0f0] py-10 px-4">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <header className="mb-7 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-[28px] font-bold text-[#1a1a1a]">📝 My Todo List</h1>
          {totalCount > 0 && (
            <p className="text-sm text-gray-600 bg-white px-3.5 py-1.5 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              {completedCount} / {totalCount} completed
            </p>
          )}
        </header>

        {/* Create Form */}
        <TodoForm onSubmit={handleCreate} isLoading={isCreating} />

        {/* Error Banner */}
        {fetchError && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 flex items-center justify-between">
            ⚠️ {fetchError}
            <button onClick={fetchTodos} className="bg-red-600 hover:bg-red-700 text-white border-none rounded-md px-3 py-1 text-xs transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={todos}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isLoading={isLoadingList}
        />
      </div>
    </main>
  );
}
