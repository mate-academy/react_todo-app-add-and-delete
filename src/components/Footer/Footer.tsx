import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterStatus: Filter;
  setFilterStatus: (filter: Filter) => void;
  handleClearCompleted: () => void;
};

const filterLinks = [
  { label: 'All', value: Filter.All },
  { label: 'Active', value: Filter.Active },
  { label: 'Completed', value: Filter.Completed },
];

export const Footer: React.FC<Props> = ({
  setFilterStatus,
  todos,
  filterStatus,
  handleClearCompleted,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed);
  const isClearCompletedDisabled = todos.every(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ label, value }) => (
          <a
            key={value}
            href={`#/${value}`}
            className={cn('filter__link', { selected: filterStatus === value })}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilterStatus(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearCompletedDisabled}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
