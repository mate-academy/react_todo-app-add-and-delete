import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteTodo: (todoId: number) => Promise<any>,
  isDeliting: boolean,
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  isDeliting,
}) => {
  const isLoading = todo.id === 0 && isDeliting;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
