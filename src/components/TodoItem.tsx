import React, { useState } from 'react';
import cn from 'classnames';
import { Todo, Error } from '../types/Todo';
import * as todosService from '../api/todos';

type Props = {
  todos?: Todo[],
  setTodos?: (value: Todo[]) => void,
  todo: Todo,
  isNewTodoLoading?: boolean
  setHasError: (value: Error) => void,
};

export const TodoItem: React.FC<Props> = ({
  todos,
  setTodos,
  todo,
  isNewTodoLoading,
  setHasError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTodoById = (todoId: number) => {
    setIsLoading(true);
    todosService.deleteTodos(todoId)
      .then(() => {
        if (setTodos && todos) {
          const newTodos: Todo[] = todos.filter(t => t.id !== todoId);

          setTodos(newTodos);
        }
      })
      .catch(() => setHasError(Error.DELETE));
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodoById(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isNewTodoLoading || isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
