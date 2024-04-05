/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useContext } from 'react';
import { ErrorMessages, Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';
import * as todoService from '../../api/todos';
import { TodoContext } from '../../TodoContext/TodoContext';

type Props = {
  todo: TodoType;
  isActive?: boolean;
};

export const Todo: React.FC<Props> = ({ todo, isActive = false }) => {
  const { setTodos, setActiveTodo, displayError, setIsLoading } =
    useContext(TodoContext);

  function handleDeleteTodo(id: number) {
    setIsLoading(true);
    setActiveTodo(todo);
    todoService
      .deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(item => item.id !== id)),
      )
      .catch(() => displayError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setActiveTodo(null);
        setIsLoading(false);
      });
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
