import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onToggle?: (todoId: Todo['id'], status: boolean) => void;
  onUpdate?: (
    todoId: Todo['id'],
    newTitle: string,
    setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
    event?: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  onDelete?: (todoId: Todo['id']) => void;
  loadingTodoIds: Todo['id'][];
};

/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  onUpdate = () => {},
  onDelete = () => {},
  onToggle = () => {},
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState('');

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {todo.id === selectedTodo?.id ? (
        <form
          onSubmit={async event => {
            await onUpdate(todo.id, updatedTodoTitle, setSelectedTodo, event);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus={selectedTodo.id === todo.id}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={async () => {
              await onUpdate(todo.id, updatedTodoTitle, setSelectedTodo);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setSelectedTodo(null);
              }
            }}
            onChange={event => setUpdatedTodoTitle(event.target.value)}
            value={updatedTodoTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            onDoubleClick={() => {
              setSelectedTodo(todo);
              setUpdatedTodoTitle(todo.title);
            }}
            onBlur={() => setSelectedTodo(null)}
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={async () => {
              await onDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
