/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  deleteTodo: (todoId: number) => void;
  todo: Todo;
  isLoading: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  deleteTodo,
  todo,
  isLoading,
}) => {
  const shoudShowLoader = isLoading && todo.id === 0;

  return (
    <CSSTransition key={0} timeout={300} classNames="temp-item">
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
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
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': shoudShowLoader,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
