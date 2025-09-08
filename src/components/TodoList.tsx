import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  filterByStatus: 'all' | 'active' | 'completed';
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, title: string) => void;
  tempTodo?: number | null;
  deletingTodos?: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
  tempTodo,
  deletingTodos = [],
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  };

  const handleSave = () => {
    if (editingId && editValue.trim()) {
      updateTodo(editingId, editValue.trim());
    }

    setEditingId(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isTemp = tempTodo === todo.id;
        const isDeleting = deletingTodos.includes(todo.id);
        const showLoader = isTemp || isDeleting;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={`todo ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => !isTemp && !isDeleting && toggleTodo(todo.id)}
                disabled={isTemp || isDeleting}
              />
            </label>

            {editingId === todo.id ? (
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => !isTemp && !isDeleting && handleDoubleClick(todo)}
              >
                {todo.title}
              </span>
            )}

            {!isTemp && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => !isDeleting && deleteTodo(todo.id)}
                disabled={isDeleting}
              >
                ×
              </button>
            )}

            <div 
              data-cy="TodoLoader" 
              className={`modal overlay${showLoader ? ' is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};