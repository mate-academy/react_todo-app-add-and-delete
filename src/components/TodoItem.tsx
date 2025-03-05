import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  editingTodoId: number | null;
  editingTodoTitle: string;
  isLoading: boolean;
  isTemporary: boolean;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onEditTodo: (todo: Todo) => void;
  onUpdateTodo: (event: React.FormEvent) => void;
  onEditingTodoTitleChange: (title: string) => void;
  onCancelEdit: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editingTodoId,
  editingTodoTitle,
  isLoading,
  isTemporary,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onUpdateTodo,
  onEditingTodoTitleChange,
  onCancelEdit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId === todo.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodoId, todo.id]);

  const todoLoadingClass = isLoading || isTemporary ? 'loading' : '';

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${todoLoadingClass}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleTodo(todo)}
          disabled={isLoading || isTemporary}
        />
        .
      </label>

      {editingTodoId === todo.id ? (
        <form className="todo__edit" onSubmit={onUpdateTodo}>
          <input
            type="text"
            value={editingTodoTitle}
            onChange={e => onEditingTodoTitleChange(e.target.value)}
            onBlur={onUpdateTodo}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                onCancelEdit();
              }
            }}
            className="todo__title-field"
            ref={inputRef}
            disabled={isLoading || isTemporary}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className={`todo__title ${todoLoadingClass}`}
            onDoubleClick={() => onEditTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={isLoading || isTemporary}
          >
            ×
          </button>
        </>
      )}

      {(isLoading || isTemporary) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter"></div>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
