import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import {
  isError, tempTodo, todos, todosToDelete,
} from '../../signals';
import { deleteTodo } from '../../api/todos';
import { ErrorValues } from '../../types/ErrorValues';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  useSignals();

  const { id, title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const isDeleting = todosToDelete.value.includes(id);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => {
        todos.value = todos.value.filter((t) => t.id !== id);
      })
      .catch(() => {
        isError.value = ErrorValues.delete;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
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
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': tempTodo.value?.id === id
            || isLoading
            || isDeleting,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
