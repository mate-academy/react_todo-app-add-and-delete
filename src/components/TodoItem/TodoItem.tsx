import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onChangeCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo, onChangeCompleted, onDelete,
}) => {
  const { completed, id, title } = todo;
  const [todoIsLoading, setTodoIsLoading] = useState(false);

  useEffect(() => {
    setTodoIsLoading(false);
  }, [completed]);

  useEffect(() => {
    if (id === 0) {
      setTodoIsLoading(true);
    }
  }, []);

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {
            onChangeCompleted(id, completed);
            setTodoIsLoading(true);
          }}
        />
      </label>

      {false
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <span className="todo__title">{title}</span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onDelete(id);
          setTodoIsLoading(true);
        }}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': todoIsLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
