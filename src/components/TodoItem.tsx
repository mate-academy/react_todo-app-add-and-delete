import cn from 'classnames';
import { FC } from 'react';
import { useTodos } from '../lib/TodosContext';
import * as serviceTodos from '../api/todos';
import { ErrorText } from '../types/ErrorText';
import type { Todo } from '../types/Todo';

export type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    isLoading,
    setIsLoading,
    processTodoIds,
    setProcessTodoIds,
    setTodos,
    setErrorMessage,
  } = useTodos();

  const { id, completed, title } = todo;

  const isActive = isLoading && processTodoIds.includes(id);

  const deleteTodos = async (deleteId: number) => {
    setProcessTodoIds(prevState => [...prevState, deleteId]);

    try {
      setIsLoading(true);
      await serviceTodos.deleteTodo(deleteId);

      setTodos(prevTodos => prevTodos.filter(t => t.id !== deleteId));
    } catch (error) {
      setErrorMessage(ErrorText.DeleteErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
    } finally {
      setProcessTodoIds(prev => prev.filter(prevId => prevId !== deleteId));
      setIsLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodos(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
