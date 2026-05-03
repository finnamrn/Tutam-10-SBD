'use client';

import { Todo, UpdateTodoPayload } from '../lib/api';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, payload: UpdateTodoPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

export default function TodoList({ todos, onUpdate, onDelete, isLoading }: TodoListProps) {
  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <p>Loading todos...</p>
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No todos yet. Add one above! 🎉</p>
      </div>
    );
  }

  return (
    <div className={styles.listWrapper}>
      {pending.length > 0 && (
        <section>
          <h3 className={styles.sectionTitle}>Pending ({pending.length})</h3>
          <div className={styles.list}>
            {pending.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section style={{ marginTop: '24px' }}>
          <h3 className={styles.sectionTitle}>Completed ({completed.length})</h3>
          <div className={styles.list}>
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
