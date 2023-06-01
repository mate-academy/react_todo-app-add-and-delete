import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType,
  onTodoRemove: (id: string) => void;
  isLoading: string[];
}

export const Todo: React.FC<TodoProps> = React.memo(({
  todo,
  onTodoRemove,
  isLoading,
}) => {
  const { completed, id, title } = todo;

  return (
    !isLoading.includes(id.toString())
      ? (
        <div
          className={cn('todo', {
            completed,
          })}
          key={id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onTodoRemove(id.toString())}
          >
            ×

          </button>

        </div>
      )
      : (
        <div
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button type="button" className="todo__remove">×</button>
          <div className={cn('modal overlay',
            { 'is-active': isLoading.includes(todo.id.toString()) })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )

  );
});
