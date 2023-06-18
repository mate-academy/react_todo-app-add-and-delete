import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
}

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, deleteTodoId,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const todoContent = useMemo(() => (
    isEditing
      ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              deleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )
  ), [isEditing, query]);

  return (
    <div
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => {
            setIsCompleted(!isCompleted);
          }}
        />
      </label>

      <span className="todo__title">{todoContent}</span>

      <div className={`modal overlay ${(!todo.id || deleteTodoId === todo.id) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
