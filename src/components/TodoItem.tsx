import React, { useState } from 'react';
import classNames from 'classnames';
import * as Action from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  title: string;
  id: number;
  status?: boolean;
  onDelete: (todos: Todo[]) => void;
  todos: Todo[];
  onError: (error: Error) => void;
  forClear: number[] | null;
  setForClear: (todoIds: number[] | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  status = false,
  title,
  id,
  onDelete,
  todos,
  onError,
  forClear,
  setForClear,
}) => {
  const [value, setValue] = useState(title);
  const [deletedTodoId, setDeletedTodoId] = useState(0);

  if (forClear?.length) {
    const newRenderedList = todos.filter(todo => !forClear.includes(todo.id));

    const promiseArr: Promise<void>[] = [];

    forClear.forEach(todoId => promiseArr.push(Action.deleteTodo(todoId)));

    Promise.all(promiseArr)
      .then(() => {
        onDelete([...newRenderedList]);
        setForClear(null);
      })
      .catch(onError);
  }

  const deleteTodo: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newRenderedList = todos.filter(todo => todo.id !== id);

    setDeletedTodoId(id);

    Action.deleteTodo(id)
      .then(() => onDelete([...newRenderedList]))
      .catch(onError)
      .finally(() => setDeletedTodoId(0));
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed: status })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={value}
          checked={status}
          onChange={event => setValue(event.target.value)}
          aria-label="Todo input field"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {value}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodoId === id || forClear?.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
