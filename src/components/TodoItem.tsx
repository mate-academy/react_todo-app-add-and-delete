import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  todo: Todo;
  isLoading: boolean;
  setTodos: (todos: Todo[]) => void;
  setError: (error: string | null) => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
};

export const TodoItem:React.FC<Props> = ({
  todos,
  todo,
  isLoading,
  setError,
  setTodos,
  isDeleting,
  setIsDeleting,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (id: number) => {
    setIsDeleting(true);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todoItem: Todo) => todoItem.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          value={todo.title}
          checked={todo.completed}
          onDoubleClick={() => setIsEditing(true)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay',
        { 'is-active': isDeleting || isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
