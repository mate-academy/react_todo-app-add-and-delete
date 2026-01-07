import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void | Todo>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void | Todo>;
  loadingTodoIds: number[];
};

export const TodoItem = ({
  todo,
  onDelete,
  onUpdate,
  loadingTodoIds,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    setNewTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isEditing) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onUpdate(todo.id, { title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed === true,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        {}
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setNewTitle(todo.title);
              }
            }}
            disabled={loadingTodoIds.includes(todo.id)}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
