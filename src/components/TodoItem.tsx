import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, removeTodo }) => {
  const { completed, title, id } = todo;

  const handleRemove = () => removeTodo(id);

  return (
    <section className="todoapp__main">
      <div className={cn('todo', {
        completed: todo.completed,
      })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={handleRemove}
        >
          ×
        </button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
