import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleCompletedStatus: (id: number) => void;
  onDelete?: (id: number) => void;
  processedId?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleCompletedStatus,
  onDelete = () => {},
  processedId,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);

  const { id, completed, title } = todo;

  const processedTodos = processedId?.includes(id) || id === 0;

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedStatus(id)}
        />
      </label>

      {isEditingTodo?.id === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={e => setIsEditingTodo({ ...todo, title: e.target.value })}
            onBlur={() => setIsEditingTodo(null)}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTodo(todo)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
