import React from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { useTodos } from '../context/TodoProvider';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    deleteTodo,
    selectedTodoIds,
    editStatus,
  } = useTodos();

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          name="TodoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => editStatus(todo.id)}
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
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay', {
            'is-active': selectedTodoIds.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
