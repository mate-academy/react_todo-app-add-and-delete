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
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const handleToggleComplete = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  function removeTodo(todoId: number) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return todosService
      .deleteTodo(todoId)
      .then(() => {})
      .catch(error => {
        setErrorMessage(`Unable to delete a todo`);
        throw error;
      });
  }

  const handleDelete = (todoId: number) => {
    removeTodo(todoId);
  };

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
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
