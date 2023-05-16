import cn from 'classnames';
import {
  memo, useEffect, useState, FC,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  completedTodos: number[];
  isClearCompletedTodos: boolean;
  onUpdateCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: FC<Props> = memo(({
  todo, onUpdateCompleted, onDelete, completedTodos, isClearCompletedTodos,
}) => {
  const { completed, id, title } = todo;
  const [todoIsEditing] = useState(false);
  const [todoIsLoading, setTodoIsLoading] = useState(false);

  useEffect(() => {
    setTodoIsLoading(false);
  }, [completed]);

  useEffect(() => {
    if (id === 0) {
      setTodoIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (isClearCompletedTodos && completedTodos.includes(id)) {
      setTodoIsLoading(true);
    }
  }, [isClearCompletedTodos]);

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
            onUpdateCompleted(id, completed);
            setTodoIsLoading(true);
          }}
        />
      </label>

      {todoIsEditing
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
});
