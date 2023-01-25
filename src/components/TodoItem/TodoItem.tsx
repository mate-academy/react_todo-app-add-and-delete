import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  onTodoDelete: (selectedTodoId: number) => void,
  isLoaderNeeded: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete,
  isLoaderNeeded,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onTodoDelete(todo.id)}
      >
        ×
      </button>

      {isLoaderNeeded && (
        <Loader />
      )}
    </div>
  );
};
