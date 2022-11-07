import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onError: (errorType: ErrorType) => void;
  onDelete: (todoId: number) => void;
  deletingIds: number[];
};

export const TodosList: React.FC<Props> = React.memo(({
  todos,
  onError,
  onDelete,
  deletingIds,
}) => {
  const [deletedTodoId, setdeletedTodoId] = useState(0);

  const handleDeleteTodo = useCallback((todoId: number) => {
    setdeletedTodoId(todoId);
    onDelete(todoId);
  }, []);

  return (
    <>
      {todos.map(({ title, completed, id }) => (
        <div
          data-cy="Todo"
          className={cn(
            'todo',
            { completed },
          )}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => onError(ErrorType.UPDATE)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              {
                'is-active': id === deletedTodoId
                  || deletingIds.includes(id),
              },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
});
