import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type FormInputEvent =
  | React.FormEvent<HTMLFormElement>
  | React.ChangeEvent<HTMLInputElement>;

type Props = {
  todo: Todo;
  multipleLoading: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  multipleLoading,
  onDelete,
  onUpdate,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleTodoTitleClick = () => {
    if (todo.id !== selectedTodo?.id) {
      setSelectedTodo(todo);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      handleTodoTitleClick();
    }
  };

  const handleTodoTitleChange = (event: FormInputEvent) => {
    event.preventDefault();
    setLoading(true);
    onUpdate?.({ ...todo, title: todoTitle })
      .then(() => setSelectedTodo(null))
      .finally(() => setLoading(false));
  };

  const handleTodoCompletedChange = () => {
    setLoading(true);
    onUpdate?.({ ...todo, completed: !todo.completed })
      .then(() => setSelectedTodo(null))
      .finally(() => setLoading(false));
  };

  const handleTodoDelete = (todoId: number) => {
    setLoading(true);
    onDelete?.(todoId)
      .then(() => setSelectedTodo(null))
      .finally(() => setLoading(false));
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoCompletedChange()}
        />
      </label>

      {todo.id !== selectedTodo?.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onClick={handleTodoTitleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleTodoTitleChange}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            onBlur={handleTodoTitleChange}
            disabled={loading}
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading || multipleLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
