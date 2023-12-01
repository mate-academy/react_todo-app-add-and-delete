import { useContext } from 'react';
import classNames from 'classnames';

import { FilterTodos } from '../../types/FilterTodos';
import { TodosContext } from '../TodosContext';

type Props = {};

export const TodosFilter: React.FC<Props> = () => {
  const { filterTodos, setFilterTodos } = useContext(TodosContext);

  const filters = Object.values(FilterTodos);

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map((nameButton) => (
        <a
          key={nameButton}
          data-cy={`FilterLink${nameButton}`}
          href={`#/${nameButton.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: nameButton === filterTodos,
          })}
          onClick={() => {
            setFilterTodos(nameButton as FilterTodos);
          }}
        >
          {nameButton}
        </a>
      ))}
    </nav>
  );
};
