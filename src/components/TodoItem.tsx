import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isEditing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  setEditedTodoId: (id: number | null) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  handleEditing: (e: React.FormEvent<HTMLFormElement>, todo: Todo) => void;
  handleBlur: (todo: Todo) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isEditing,
  editText,
  setEditText,
  setEditedTodoId,
  deleteTodo,
  toggleTodo,
  handleEditing,
  handleBlur,
  isLoading,
}) => {
  const handleDoubleClick = () => {
    setEditedTodoId(todo.id);
    setEditText(todo.title);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <span style={{ display: 'none' }}>Toggle todo status</span>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={e => handleEditing(e, todo)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={() => handleBlur(todo)}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
