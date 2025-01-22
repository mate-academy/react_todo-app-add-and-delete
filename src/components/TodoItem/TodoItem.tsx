import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<void>;
  isAdding?: boolean;
  isDeleting?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, deleteTodo, isAdding = false, isDeleting = false }) => {
    const handleDeleteTodo = async () => {
      await deleteTodo(todo.id);
    };

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label
          className="todo__status-label"
          htmlFor={`todo__status-${todo.id}`}
        >
          {/* this checkbox should be checked if todo is completed */}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo__status-${todo.id}`}
            defaultChecked={todo.completed}
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
          onClick={handleDeleteTodo}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isAdding || isDeleting,
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
