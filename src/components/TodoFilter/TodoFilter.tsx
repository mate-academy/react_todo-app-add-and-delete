import React from 'react';
import { FilterTodo } from '../../types/Filter';

type Props = {
  filter: FilterTodo;
  setFilter: (value: FilterTodo) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  const filters: { label: string; value: FilterTodo; dataCy: string }[] = [
    { label: 'All', value: FilterTodo.All, dataCy: 'FilterLinkAll' },
    { label: 'Active', value: FilterTodo.Active, dataCy: 'FilterLinkActive' },
    {
      label: 'Completed',
      value: FilterTodo.Completed,
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filteredValue => (
        <a
          key={filteredValue.value}
          href="#/"
          className={`filter__link ${filter === filteredValue.value ? 'selected' : ''}`}
          data-cy={filteredValue.dataCy}
          onClick={() => setFilter(filteredValue.value)}
        >
          {filteredValue.label}
        </a>
      ))}
    </nav>
  );
};
