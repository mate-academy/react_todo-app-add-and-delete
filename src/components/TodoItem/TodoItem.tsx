import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodoHandler: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodoHandler,

}) => {
  const { completed, title, id } = todo;
  // const [completedStatus, setCompletedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        // onChange={() => {
        //   todo.completed = completedStatus;
        //   setCompletedStatus(prev => !prev);
        // }}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setIsLoading(true);

          deleteTodoHandler(id);
        }}
        disabled={isLoading}
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
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
