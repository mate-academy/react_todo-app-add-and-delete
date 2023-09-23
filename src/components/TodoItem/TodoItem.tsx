import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  isCompliteDeleting: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, isCompliteDeleting,
}) => {
  const { id, completed, title } = todo;
  const [loading, setLoading] = useState(false);

  const deleteTodoWithLoader = () => {
    setLoading(true);
    deleteTodo(id);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (isCompliteDeleting && todo.completed) {
      setLoading(true);
    }
  }, [isCompliteDeleting]);

  return (
    <>
      <div className={classNames(
        'todo',
        { completed },
      )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodoWithLoader()}
        >
          ×
        </button>

        <div className={classNames('modal overlay', {
          'is-active': loading,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
