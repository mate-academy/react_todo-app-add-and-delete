import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useTodosContext } from '../store';
import { apiClient } from '../../api/todos';
import { ErrorOption } from '../../enum/ErrorOption';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    removeTodo,
    toggleTodoCondition,
    setError,
    deletingTodoIds,
  } = useTodosContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDeleting = deletingTodoIds.includes(todo.id);

  const loaderCondition = isDeleting || isLoading || todo.id === 0;

  const handlerDeleteTodo = async (todoId: number) => {
    setIsLoading(true);

    try {
      await apiClient.deleteTodo(todoId);
      removeTodo(todoId);
    } catch (error) {
      setError(ErrorOption.DeleteTodoError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoCondition(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {isHovered && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handlerDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being updated is-active */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loaderCondition,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
