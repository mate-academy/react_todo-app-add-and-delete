import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isDeleted: number | null;
  isLoading: boolean,
  title: string,
  errorMessage: string,
};

export const AppList: React.FC<Props> = ({
  todos,
  onDelete,
  isDeleted,
  isLoading,
  title,
  errorMessage,
}) => {
  const handleDelete = (todoId: number) => {
    onDelete(todoId);
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
          <div className={classNames('modal overlay', {
            'is-active': todo.id === isDeleted,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {(!errorMessage && isLoading) && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
