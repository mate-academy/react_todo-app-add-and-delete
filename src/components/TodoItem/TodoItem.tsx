import classNames from 'classnames';
import React, { useMemo } from 'react';

import { Todo } from '../../types/Todo';

import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedId,
  isAdding,
}) => {
  const { title, completed, id } = todo;

  const isLoader = useMemo(() => (
    selectedId.includes(id) || (isAdding)
  ), []);

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      {isLoader && (
        <TodoLoader />
      )}
    </div>
  );
};
