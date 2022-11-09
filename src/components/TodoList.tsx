import React, { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../enums/Status';
import { Todo } from '../types/Todo';
import { StatusContext } from './StatusContext';

type Porps = {
  todos: Todo[];
};

export const TodoList: React.FC<Porps> = ({ todos }) => {
  const { selectStatus } = useContext(StatusContext);

  const filterStatus = [...todos].filter(todo => {
    switch (selectStatus) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterStatus.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
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
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
