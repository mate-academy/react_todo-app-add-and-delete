import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  setError: (message: string) => void;
  loading: number | null;
  deleteTodo: (id: number) => void;
  updateTodoCheck: (id: number) => void;
  updateTodoTitle: (event: React.FormEvent, id: number, value: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setError,
  loading,
  deleteTodo,
  updateTodoCheck,
  updateTodoTitle,
}) => {
  const [title, setTitle] = useState('');
  const [isEditingId, setIsEditingId] = useState<number | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleDoubleClick = (objTodo: Todo) => {
    setIsEditingId(objTodo.id);
    setTitle(objTodo.title);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo__status-${todo.id}`}>
        <input
          id={`todo__status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodoCheck(todo.id)}
        />
      </label>

      {isEditingId === todo.id ? (
        <form
          onSubmit={event => {
            updateTodoTitle(event, todo.id, title);
            setIsEditingId(null);
            setTitle('');
          }}
        >
          <input
            type="text"
            // className="todo__active"
            value={title}
            onBlur={event => {
              updateTodoTitle(event, todo.id, title);
              setIsEditingId(null);
              setTitle('');
            }}
            onChange={handleInput}
            disabled={loading !== 0}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDoubleClick({ ...todo })}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      {isEditingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading === todo.id || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
