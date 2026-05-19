import cn from 'classnames';
import { TodoItem } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { useState } from 'react';

type Props = {
  todo: TodoItem;
  setErrorMessage: (message: string) => void;
  onDeleteTodo: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Todo: React.FC<Props> = ({
  todo,
  setErrorMessage,
  onDeleteTodo,
  inputRef,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const isTemp = todo.id === 0;

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTodo(todo.id)
      .then(() => {
        onDeleteTodo(todo.id);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsDeleting(false);
        inputRef.current?.focus();
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTemp || isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
