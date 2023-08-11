import React from 'react';
import classNames from 'classnames';
import { Status } from '../../enum/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: Status,
  setFilterBy: (filterBy: Status) => void,
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  todos,
  deleteAllCompleted,
}) => {
  const completedTodo = todos.filter(todo => todo.completed);
  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;

  const handleFilterStatus = (filter: Status) => () => {
    setFilterBy(filter);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodosQuantity} ${activeTodosQuantity === 1 ? 'item' : 'items'} left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterBy === Status.all,
              })}
              onClick={handleFilterStatus(Status.all)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterBy === Status.active,
              })}
              onClick={handleFilterStatus(Status.active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterBy === Status.completed,
              })}
              onClick={handleFilterStatus(Status.completed)}
            >
              Completed
            </a>
          </nav>

          {completedTodo && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteAllCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
