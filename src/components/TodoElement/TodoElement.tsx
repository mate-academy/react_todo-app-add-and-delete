/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';

type Props = {
  deleteTodo: (id: number) => void;
  loadingIds: number[];
  todo: Todo;
  loader: boolean;
};

export const TodoElement: React.FC<Props> = ({
  deleteTodo,
  loadingIds,
  todo,
  loader,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
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
        onClick={() => deleteTodo(todo.id)}
        disabled={loader}
      >
        ×
      </button>

      <Loader todo={todo} loadingIds={loadingIds} />
    </div>
  );
};
