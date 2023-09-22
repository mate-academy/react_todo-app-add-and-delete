import classNames from 'classnames';
import React, { useState } from 'react';
import * as todosApi from '../../api/todos';

import { useTodos } from '../../TodosContext';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo,
    tempTodo,
    setTodos,
    setErrorMessage,
    removeErrorIn3sec,
    removingCompleted,
    isSubmiting,
  } = useTodos();

  const { title, completed, id } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleTodo = () => {
    toggleTodo(id);
  };

  const handleDeleteTodo = () => {
    setIsDeleting(true);

    todosApi.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          item => item.id !== id,
        ));
      })
      .catch(() => {
        setErrorMessage(Errors.deleting);

        removeErrorIn3sec();
      })
      .finally(() => setIsDeleting(false));
  };

  const isModalActive
    = (tempTodo?.id === id && isSubmiting)
    || isDeleting
    || (removingCompleted && completed);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        hidden: todo === null,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      <span
        className="todo__title"
        data-cy="TodoTitle"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isModalActive,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
