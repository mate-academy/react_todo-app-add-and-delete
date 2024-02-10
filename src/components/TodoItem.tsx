import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../TodosContext';
import { deleteTodo } from '../api/todos';

interface Props {
  todo: Todo
  isLoading?: boolean
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { setTodos, setErrorMessage } = useContext(TodosContext);
  const [loading, setLoading] = useState(isLoading);

  const { id, title, completed } = todo;

  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => handleCatch());

    setTodos((prev) => prev.filter((t) => t.id !== todoId));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        // eslint-disable-next-line quote-props
        { 'completed': completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteTodo(id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': loading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
