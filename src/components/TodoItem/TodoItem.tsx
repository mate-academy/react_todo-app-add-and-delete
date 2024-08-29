/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { RefObject, useEffect, useState } from 'react';
import { deleteTodo } from '../../utils/helpers';

type Props = {
  todo: Todo;
  setTodos: (update: (todos: Todo[]) => Todo[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadingWhileDelete: (isLoading: boolean) => void;
  isLoading?: boolean;
  isLoadingWhileDelete: boolean;
  inputRef: RefObject<HTMLInputElement>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  isLoading,
  setIsLoadingWhileDelete,
  isLoadingWhileDelete,
  inputRef,
  setHasError,
  setErrorMessage,
}) => {
  const [isCompleated, setIsCompleated] = useState<boolean>(todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleDelete = () => {
    setIsLoadingWhileDelete(true);
    deleteTodo(
      todo.id,
      setTodos,
      setIsLoadingWhileDelete,
      setHasError,
      setErrorMessage,
      () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    );
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
