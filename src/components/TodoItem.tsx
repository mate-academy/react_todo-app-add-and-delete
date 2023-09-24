import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handledeleteTodo: (value: number) => void,
  isDeletedTodo: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handledeleteTodo,
  isDeletedTodo,
}) => {
  const { completed, title, id } = todo;
  const [completedStatus, setCompletedStatus] = useState(completed);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: completedStatus },
        )}
      >

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completedStatus}
            onChange={(event) => {
              setCompletedStatus(event.target.checked);
            }}
          />
        </label>

        <span
          className="todo__title"
          data-cy="TodoTitle"
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => (handledeleteTodo(id))}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal',
            'overlay',
            { 'is-active': (isDeletedTodo.includes(todo.id) || id === 0) },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

      </div>
    </>
  );
};
