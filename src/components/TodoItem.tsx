/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import classNames from 'classnames';

interface TodoProps {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  pending: number | null;
}

const TodoItem: React.FC<TodoProps> = ({ todo, onDeleteTodo, pending }) => {
  const handleDeleteClick = async () => {
    try {
      await onDeleteTodo(todo.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': pending === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
