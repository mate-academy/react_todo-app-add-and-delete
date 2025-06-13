/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/todo/Todo';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  onTodoDelete?: (todoId: number) => void;
  todoToDeleteIds?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempTodo = false,
  onTodoDelete,
  todoToDeleteIds,
}) => {
  const isLoaderVisible = (todoId: number) => {
    return isTempTodo || todoToDeleteIds?.includes(todoId);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
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
        onClick={() => {
          if (onTodoDelete) {
            onTodoDelete(todo.id);
          }
        }}
        disabled={isTempTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoaderVisible(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
