import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { title, completed } = todoItem;

  return (
    <>
      {/* This todo is not completed */}
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
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <TodoLoader />
      </div>
    </>
  );
};
