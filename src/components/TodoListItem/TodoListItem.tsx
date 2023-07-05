import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  completedIds: number[];
}

export const TodoListItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  completedIds,
}) => {
  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={cn('modal', 'overlay', {
          'is-active': completedIds.includes(todo.id), // deletedIds.includes(todo.id)
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
