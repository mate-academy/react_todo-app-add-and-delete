import classNames from 'classnames';
import React, { useState } from 'react';
import { removeTodo, updateComplete } from '../../api/todos';
import { Error, Todo } from '../../types/todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  isProcessing: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  todos,
  setHasError,
  isProcessing,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEdited] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const removeTodoHandler = (todoId: number) => {
    setIsDeleting(true);

    removeTodo(todoId)
      .then(() => {
        const newTodos = todos.filter(t => t.id !== todoId);

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Delete);
      })
      .finally(() => setIsDeleting(false));
  };

  const toggleComplete = (todoId: number) => {
    setIsToggling(true);

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
      .finally(() => setIsToggling(false));
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
        'is-active': isDeleting || isToggling || isProcessing || todo.id === 0,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
