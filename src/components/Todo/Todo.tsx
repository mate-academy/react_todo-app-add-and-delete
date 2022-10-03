import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  deleteTodo: (todo: Todo) => void;
  isCompleted: boolean;
  visibleLoader: boolean;
};

export const UserTodo: React.FC<Props> = ({
  todo,
  deleteTodo,
  isCompleted,
  visibleLoader,
}) => {
  const [touched, setTouched] = useState<boolean>(false);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: isCompleted || touched },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            setTouched(prevTouched => !prevTouched);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          return deleteTodo({
            title: todo.title,
            userId: todo.userId,
            id: todo.id,
            completed: todo.completed,
          });
        }}
      >
        ×
      </button>

      {visibleLoader && (
        <Loader />
      )}
    </div>
  );
};
