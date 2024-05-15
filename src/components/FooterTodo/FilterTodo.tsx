import { FC, useContext } from 'react';

import classNames from 'classnames';
import { FilterContext } from '../../Context/FilterContext';
import { FilterType } from '../../types/FilterType';
import { FilterLink } from '../../types/FilterLink';

interface IProps {
  items: FilterLink[];
}

export const FilterFooter: FC<IProps> = ({ items }) => {
  const { filterType, showAllTodos, showActiveTodos, showCompletedTodos } =
    useContext(FilterContext);

  const handleFilter = (title: string) => {
    switch (title) {
      case FilterType.Completed:
        showCompletedTodos();
        break;
      case FilterType.Active:
        showActiveTodos();
        break;
      default:
        showAllTodos();
    }
  };

  return (
    <nav className="filter" data-cy="Filter">
      {items.map(item => (
        <a
          key={item.dataCy}
          href={item.href}
          className={classNames('filter__link', {
            selected: filterType === item.title,
          })}
          data-cy={item.dataCy}
          onClick={() => {
            handleFilter(item.title);
          }}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
};
