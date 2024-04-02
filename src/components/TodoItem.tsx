import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useState } from 'react';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  deleteTodo: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading, deleteTodo }) => {
  const { title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodo = (id: number) => {
    setIsDeleting(true);

    deleteTodo(id).finally(() => setIsDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          id="todoCheckbox"
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <Loader isLoading={isDeleting} />

      {/* overlay will cover the todo while it is being deleted or updated */}
      {isLoading && <Loader isLoading={isLoading} />}
    </div>
  );
};
