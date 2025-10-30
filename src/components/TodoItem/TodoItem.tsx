import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

export type TodoItemProps = {
  todo: Todo;
  isLoading: (todoId: Todo['id']) => boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          aria-label={`Mark todo "${todo.title}" as completed`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          disabled
        />
      </label>

      {selectedTodo?.id === todo.id ? (
        <form>
          <input
            ref={titleRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={() => setSelectedTodo(null)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
