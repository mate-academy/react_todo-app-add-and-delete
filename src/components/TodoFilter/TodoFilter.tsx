import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/FilteredBy';

type Props = {
  filteredTodos: FilterBy;
  setFilteredTodos: (value: FilterBy) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filteredTodos,
  setFilteredTodos,
}) => (
  <>
    {Object.values(FilterBy).map(option => (
      <a
        key={option}
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filteredTodos === option },
        )}
        onClick={() => setFilteredTodos(option)}
      >
        {option}
      </a>
    ))}
  </>
);
