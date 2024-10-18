import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/Errors';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number[]) => Promise<PromiseSettledResult<void>[]>;
  onErrorMessageChange: (error: Errors) => void;
}

export const TodoBody: React.FC<Props> = ({ todo, onDeleteTodo }) => {
  const [isPending, setIsPending] = useState(false);

  const handleChangeTodo = (
    callback: (arg: number[]) => Promise<PromiseSettledResult<void>[]>,
    valueToCall: number[],
  ) => {
    setIsPending(true);
    if (valueToCall) {
      callback(valueToCall).finally(() => setIsPending(false));
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
        onClick={() => {
          handleChangeTodo(onDeleteTodo, [todo.id]);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
