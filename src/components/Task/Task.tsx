import React, { useCallback, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  editing?: boolean
  loading?: boolean
  deleteTodo?: (id: string) => Promise<void>
};

const Task: React.FC<Props> = React.memo(({
  todo,
  editing = false,
  loading = false,
  deleteTodo,
}) => {
  const [showSpinner, setShowSpinner] = useState(loading);

  const onDeleteHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { todoId } = event.currentTarget.dataset;

      if (todoId && deleteTodo) {
        setShowSpinner(true);

        deleteTodo(todoId).finally(() => {
          setShowSpinner(false);
        });
      }
    }, [],
  );

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {editing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            data-todo-id={todo.id}
            onClick={onDeleteHandler}
            className="todo__remove"
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': showSpinner,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

export { Task };
