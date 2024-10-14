import classNames from 'classnames';
import React from 'react';

import { Todo } from '../../types/Todo';
import { FilterCriteria } from '../../types/FilterCriteria';

type Props = {
  handleFilter: (filterType: FilterCriteria) => void;
  filter: FilterCriteria;
  todos: Todo[] | null;
  deleteTodo: (todoId: number) => void;
  activeTodos: number;
  completedTodos: number;
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const Footer: React.FC<Props> = ({
  handleFilter,
  filter,
  todos,
  deleteTodo,
  activeTodos,
  completedTodos,
}) => {
  const handleClearCompleted = () => {
    todos?.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const correctItemTerm = activeTodos === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} {correctItemTerm} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterCriteria).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType}`}
            className={classNames('filter__link', {
              selected: filter === filterType,
            })}
            data-cy={`FilterLink${capitalizeFirstLetter(filterType)}`}
            onClick={() => {
              handleFilter(filterType);
            }}
          >
            {capitalizeFirstLetter(filterType)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
