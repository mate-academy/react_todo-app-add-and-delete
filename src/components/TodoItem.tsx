/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import * as todoMethods from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todo: Todo;
  fetchData: () => void;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | string>>;
  isTempt?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  fetchData,
  setErrorMessage,
  isTempt,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    todoMethods
      .deleteTodo(todoId)
      .then(() => fetchData())
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
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
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTempt || isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
