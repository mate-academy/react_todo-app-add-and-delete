import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  deletedIds: number[],
};

export const TodoList: React.FC<Props> = ({ todos, handleDeleteTodo, deletedIds }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({id, completed, title}) => {
        return (
          <div
            data-cy="Todo"
            key={id}
            className={classNames('todo', {
              completed: completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked={completed}
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': deletedIds.includes(id),
              })}

            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
