import classNames from 'classnames';
import React, { useState } from 'react';
import { removeTodo, updateComplete } from '../../api/todos';
import { Error, Todo } from '../../types/todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  todos,
  setHasError,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEdited] = useState(false);

  const removeTodoHandler = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        const newTodos = todos.filter(t => t.id !== todoId);

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Delete);
      });
  };

  const toggleComplete = (todoId: number) => {
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
      });
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

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
