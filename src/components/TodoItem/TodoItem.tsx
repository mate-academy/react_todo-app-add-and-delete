import classNames from 'classnames';
import React, { useState } from 'react';
import { removeTodo, updateComplete } from '../../api/todos';
import { Error, Todo } from '../../types/todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  todos,
  setHasError,
  isLoading,
  setIsLoading,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEdited] = useState(false);

  const removeTodoHandler = (todoId: number) => {
    setIsLoading(true);

    removeTodo(todoId)
      .then(() => {
        const newTodos = todos.filter(t => t.id !== todoId);

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Delete);
      })
      .finally(() => setIsLoading(false));
  };

  const toggleComplete = (todoId: number) => {
    setIsLoading(true);

    updateComplete(todoId, { completed: !todo.completed })
      .then(() => {
        const newTodos = todos.map(t => {
          if (t.id === todoId) {
            return {
              ...t,
              completed: !todo.completed,
            };
          }

          return t;
        });

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Update);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
      </label>

      {!isEdited ? (
        <>
          <span className="todo__title">{todo.title}</span>

          {isHovered && (
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodoHandler(todo.id)}
            >
              ×
            </button>
          )}
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
