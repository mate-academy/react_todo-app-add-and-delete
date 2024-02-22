import React, { useState } from 'react';
import classNames from 'classnames';
import * as postService from '../../api/todos';

import { Todo } from '../../types/Todo';
import { useTodos } from '../../Store';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage, clearError, handleChangeStatus } =
    useTodos();

  const [isLoading, setIsLoading] = useState(false);

  function deleteTodo(todoId: number) {
    setIsLoading(true);

    postService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToDeleteaTodo);
        clearError();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeStatus(todo.id)}
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
        disabled={isLoading}
      >
        ×
      </button>

      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
