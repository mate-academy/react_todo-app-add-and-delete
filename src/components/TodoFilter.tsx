import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodosContext';
import { TodosFilter } from '../types/TodosFilter';

export const TodoFilter: React.FC = () => {
  const {
    todosFilter,
    setTodosFilter,
  } = useContext(TodosContext);

  const handleLink = (val: string) => {
    if (TodosFilter.all) {
      return '#/';
    }

    return `#/${val.toLowerCase()}`;
  };

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(TodosFilter).map(val => (
        <a
          href={handleLink(val)}
          onClick={() => {
            setTodosFilter(val);
          }}
          data-cy={`FilterLink${val}`}
          className={cn('filter__link', {
            selected: todosFilter === val,
          })}
          key={val}
        >
          {val}
        </a>
      ))}
    </nav>
  );
};
