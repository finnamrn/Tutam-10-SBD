'use client';

import { useState } from 'react';
import { CreateTodoPayload } from '../lib/api';

interface TodoFormProps {
  onSubmit: (payload: CreateTodoPayload) => Promise<void>;
  isLoading: boolean;
}

export default function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create todo');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-6">
      <h2 className="text-[18px] font-semibold text-[#333] mb-4">Add New Todo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="What needs to be done? *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-[14px] py-[10px] border-[1.5px] border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#4f46e5]"
            maxLength={255}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-[14px] py-[10px] border-[1.5px] border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#4f46e5] resize-y"
            rows={2}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-600 text-[13px] -mt-1">{error}</p>}
        <button 
          type="submit" 
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white border-none rounded-lg px-5 py-[10px] text-sm font-medium transition-all self-start disabled:opacity-60 disabled:cursor-not-allowed" 
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : '+ Add Todo'}
        </button>
      </form>
    </div>
  );
}
