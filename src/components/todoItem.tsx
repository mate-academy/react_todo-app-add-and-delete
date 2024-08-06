import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  editingTodoId: number | null;
  editingTodoTitle: string;
  loading: boolean;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onEditTodo: (todo: Todo) => void;
  onUpdateTodo: (event: React.FormEvent, todoId: number) => void;
  onEditingTodoTitleChange: (title: string) => void;
  onCancelEdit: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editingTodoId,
  editingTodoTitle,
  loading,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onUpdateTodo,
  onEditingTodoTitleChange,
  onCancelEdit,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      {editingTodoId === todo.id ? (
        <form onSubmit={event => onUpdateTodo(event, todo.id)}>
          <input
            type="text"
            value={editingTodoTitle}
            onChange={e => onEditingTodoTitleChange(e.target.value)}
            onBlur={event => onUpdateTodo(event, todo.id)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                onCancelEdit();
              }
            }}
            className="todo__edit"
          />
        </form>
      ) : (
        <>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
          >
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo)}
              disabled={loading}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
