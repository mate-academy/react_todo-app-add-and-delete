import React, { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../enums/Filter';
import { Todo } from '../types/Todo';
import { FilterContext } from './FilterContext';
import { ErrorEnums } from '../enums/ErrorEnums';

interface Porps {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  onError: (errorType: ErrorEnums ) => void;
};

export const TodoList: React.FC<Porps> = ({
  todos,
  deleteTodo,
  onError,
}) => {
  const { selectedFilterStatus } = useContext(FilterContext);

  const filterStatus = [...todos].filter(todo => {
    switch (selectedFilterStatus) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterStatus.map(({ id, title, completed }) => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: completed },
          )}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
              onChange={() => onError(ErrorEnums.Update)}
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
            onClick={() => deleteTodo(id) }
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
