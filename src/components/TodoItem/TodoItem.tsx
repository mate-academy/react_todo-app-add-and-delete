/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useRef, useState } from 'react';
import { deleteTodo } from '../../utils/helpers';

type Props = {
  todo: Todo;
  setTodos: (update: (todos: Todo[]) => Todo[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadingWhileDelete: (isLoading: boolean) => void;
  isLoading?: boolean;
  isLoadingWhileDelete: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  isLoading,
  setIsLoadingWhileDelete,
  isLoadingWhileDelete,
}) => {
  const [isCompleated, setIsCompleated] = useState<boolean>(todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    setIsLoadingWhileDelete(true);
    deleteTodo(todo.id, setTodos, setIsLoadingWhileDelete, () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: isCompleated,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => setIsCompleated(prev => !prev)}
          checked={isCompleated}
          ref={inputRef}
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
        disabled={isLoadingWhileDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isLoadingWhileDelete,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
