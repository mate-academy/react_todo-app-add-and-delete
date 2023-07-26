/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import { useState, useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types';

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempTodo,
}) => {
  const {
    todoDelete,
    areCompletedDeletingNow,
  } = useContext(TodosContext);

  const [isLoading, setIsLoading] = useState(isTempTodo || false);

  const handleOnDelete = () => {
    setIsLoading(true);

    todoDelete(todo.id)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleOnDelete}
      >
        ×
      </button>

      <div
        className={cn('modal', 'overlay', {
          'is-active': isLoading || (areCompletedDeletingNow && todo.completed),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
