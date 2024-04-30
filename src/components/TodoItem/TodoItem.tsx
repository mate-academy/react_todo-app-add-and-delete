/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import * as todosService from '../../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: string) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
}) => {
  const handleToggleComplete = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    setTodos(updatedTodos);
    setTimeout(() => {
      setLoadingTodoIds(prevIds =>
        prevIds.filter(prevTodoId => prevTodoId !== todoId),
      );
    }, 500);
  };

  function removeTodo(todoId: number) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== todoId),
        );
      });
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleComplete(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      {loadingTodoIds.includes(id) && (
        <div
          className={classNames('modal overlay', {
            'is-active': loadingTodoIds.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
