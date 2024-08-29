import React from 'react';
import { Todo } from '../../types/Todo';
import { Filters } from '../Filters/Filters';
import { countActiveTodos } from '../../utils/countActiveTodos';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setFilter: (filterBy: Filters) => void;
  onDelete: (id: number) => void;
  filter: Filters;
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
  onDelete,
  todos,
}) => {
  const filterLinks = [
    { key: Filters.All, href: '#/', label: 'All', dataCy: 'FilterLinkAll' },
    {
      key: Filters.Active,
      href: '#/active',
      label: 'Active',
      dataCy: 'FilterLinkActive',
    },
    {
      key: Filters.Completed,
      href: '#/completed',
      label: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  const isNoCompletedTodos =
    todos.length - countActiveTodos(todos).length === 0;

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos(todos).length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ key, href, label, dataCy }) => (
          <a
            key={key}
            href={href}
            className={cn('filter__link', { selected: filter === key })}
            data-cy={dataCy}
            onClick={() => setFilter(key)}
          >
            {label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isNoCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
