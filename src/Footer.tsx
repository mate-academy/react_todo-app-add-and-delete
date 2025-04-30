import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FilterEnum } from './types/filterEnum';

interface Props {
  todos: Todo[];
  filter: FilterEnum;
  setFilter: (filter: FilterEnum) => void;
  clearCompleted: () => void;
  loadingTodo: number | null;
}

const filterLinks = [
  { label: 'All', value: FilterEnum.All, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: FilterEnum.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: FilterEnum.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
  loadingTodo,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== loadingTodo,
  ).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ label, value, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            onClick={() => setFilter(value)}
            data-cy={dataCy}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear Completed
      </button>
    </footer>
  );
};
