import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  todoDelete: (todo: Todo) => void;
  isCompleted: boolean;
  visibleLoader: boolean;
  newTodoId: number;
};

export const UserTodo: React.FC<Props> = ({
  todo,
  todoDelete,
  isCompleted,
  visibleLoader,
  newTodoId,
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
          todoDelete(todo);
        }}
      >
        ×
      </button>

      {
        visibleLoader && newTodoId === todo.id
          ? (
            <Loader />
          )
          : ''
      }
    </div>
  );
};
