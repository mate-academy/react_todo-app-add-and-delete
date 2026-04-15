import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo as TodoType } from '../../types/Todo';
import * as client from '../../api/todos';
import { ERROR_MESSAGES } from '../../App';

type Props = {
  todo: TodoType;
  isUpdating?: boolean;
  deleteTodo?: (todoId: number) => void;
  setErrorMessage?: (message: string) => void;
};

const TodoBase: React.FC<Props> = ({
  todo,
  isUpdating = false,
  deleteTodo = () => {},
  setErrorMessage = () => {},
}) => {
  const [isTodoUpdating, setIsTodoUpdating] = useState(isUpdating);

  const handleDeleteTodo = () => {
    setIsTodoUpdating(true);
    client
      .deleteTodo(todo.id)
      .then(() => {
        deleteTodo(todo.id);
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.failedDeletingTodo);
      })
      .finally(() => {
        setIsTodoUpdating(false);
      });
  };

  useEffect(() => {
    setIsTodoUpdating(isUpdating);
  }, [isUpdating]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isTodoUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const Todo = React.memo(TodoBase);
