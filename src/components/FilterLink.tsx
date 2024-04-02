import { FC, ReactNode, useCallback } from 'react';
import { Filter } from '../types';
import { useTodos } from '../utils/TodosContext';
import cn from 'classnames';

export const FilterLink: FC<{ filterType: Filter; children: ReactNode }> = ({
  filterType,
  children,
}) => {
  const { filter, setFilter } = useTodos();
  const handleClick = useCallback(() => {
    setFilter(filterType);
  }, [filterType, setFilter]);

  return (
    <a
      href={`#/${filterType}`}
      data-cy={`FilterLink${filterType}`}
      className={cn('filter__link', {
        selected: filter === filterType,
      })}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
