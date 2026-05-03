'use client';

import { useState } from 'react';
import { Todo, UpdateTodoPayload } from '../lib/api';
import styles from './TodoItem.module.css';

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
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.left}>
        <button
          className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
          onClick={handleToggleComplete}
          disabled={isUpdating || isDeleting}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && '✓'}
        </button>
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{todo.title}</p>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        <p className={styles.date}>Created: {formatDate(todo.created_at)}</p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.deleteBtn}
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
