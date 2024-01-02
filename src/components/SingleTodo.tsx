import {
  FC, useContext, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { AppContext } from '../context/AppContext';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo,
};

export const SingleTodo: FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    tempTodo, loadData, setErrorMessage, setShowError,
  } = useContext(AppContext);

  const handleTodoRemove = async () => {
    setIsLoading(true);

    try {
      await removeTodo(todo.id);
      await loadData();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tempTodo?.id === todo.id) {
      setIsLoading(true);
    }
  }, [tempTodo?.id]);

  return (
    <>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoRemove}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </>
  );
};
