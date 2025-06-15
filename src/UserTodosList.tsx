import React from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[] | null;
  //onChecked: (todoId: number) => void;
  onDeleted: (todoId: number) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  tempTodo?: Todo;
};

export const UserTodosList = ({
  todos /*, onChecked*/,
  onDeleted,
  isLoading = false,
  isDeleting = false,
}: Props) => {
  if (!todos) {
    return null;
  }

  return (
    <>
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames({
            todo: true,
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              //onChange={() => onChecked(todo.id)}
            />
            {/* Możesz tu dodać tekst jeśli chcesz, ale masz osobny span */}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleted(todo.id)}
            disabled={isDeleting || isLoading}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading || isDeleting,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};
