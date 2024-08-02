import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useDeleteTodo } from '../../hooks/useDeleteTodo';
import { useTodos } from '../../utils/TodoContext';
import { ErrorType } from '../../types/ErrorType';

type TodoItemProps = {
  todo: Todo;
  isTemp?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isTemp }) => {
  const { deleteTodo, isDeleting, error } = useDeleteTodo();
  const [showLoader, setShowLoader] = useState(false);
  const { triggerFocus, setError } = useTodos();

  const handleDelete = async () => {
    setShowLoader(true);
    const success = await deleteTodo(todo.id);

    if (!success) {
      setShowLoader(false);
      setError(ErrorType.UnableToDeleteTodo);
    } else {
      triggerFocus();
    }
  };

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`overlay ${isTemp || showLoader ? 'is-active' : ''}`}
        style={{ display: isTemp || showLoader ? 'flex' : 'none' }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
