import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void,
  isProcessed: boolean
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isProcessed,
}) => {
  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {isProcessed && <Loader />}
    </div>
  );
};
