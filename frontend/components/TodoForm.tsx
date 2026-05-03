'use client';

import { useState } from 'react';
import { CreateTodoPayload } from '../lib/api';
import styles from './TodoForm.module.css';

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
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Add New Todo</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="What needs to be done? *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            maxLength={255}
            disabled={isLoading}
          />
        </div>
        <div className={styles.inputGroup}>
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            rows={2}
            disabled={isLoading}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Adding...' : '+ Add Todo'}
        </button>
      </form>
    </div>
  );
}
