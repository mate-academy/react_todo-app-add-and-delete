import React from 'react';
import { Status } from '../../types/Status';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type FooterProps = {
  filteredBy: Status;
  setFilteredBy: React.Dispatch<React.SetStateAction<Status>>;
  todosCounter: number;
  clearCompleted: () => void;
  completedTodos: Todo[];
};

export const Footer: React.FC<FooterProps> = ({
  filteredBy,
  setFilteredBy,
  todosCounter,
  clearCompleted,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map((filter: Status) => {
          return (
            <a
              href={`#/${filter === Status.All ? '' : filter.toLowerCase()}`}
              key={filter}
              className={classNames('filter__link', {
                selected: filteredBy === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setFilteredBy(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
