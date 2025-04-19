import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type TodoItemProps = {
  todo: Todo;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  isLoad?: boolean;
  todoIdsToDelete?: number[];
  inputTodoRef?: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({
    todo,
    isLoad,
    setTodos = () => {},
    setError = () => {},
    todoIdsToDelete,
    inputTodoRef,
  }) => {
    const { completed, title, id } = todo;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (isLoad) {
        setIsLoading(true);
      }

      const needLoad = todoIdsToDelete?.some(idToDelete => idToDelete === id);

      if (needLoad) {
        setIsLoading(true);
      }

      return () => setIsLoading(false);
    }, [isLoad, todoIdsToDelete, id]);

    const handleDelete = () => {
      setIsLoading(true);

      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => {
          setIsLoading(false);
          inputTodoRef?.current?.focus();
        });
    };

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
        })}
      >
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
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
          onClick={handleDelete}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
