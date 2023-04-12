import { FC } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType,
  onFilterChange: (filter: FilterType) => void,
  activeTodos: number,
  onDeleteCompleted: () => void,
};

export const Footer: FC<Props> = (props) => {
  const {
    filterType,
    onFilterChange,
    activeTodos,
    onDeleteCompleted,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map((filterName) => {
          const filterNameLowerCase = filterName.toLowerCase();
          const isCurFilterName = filterName === filterType;

          return (
            <a
              key={filterName}
              href={`#/${filterNameLowerCase}`}
              className={classNames(
                'filter__link',
                { selected: isCurFilterName },
              )}
              onClick={() => onFilterChange(filterName)}
            >
              {filterName}
            </a>
          );
        })}
      </nav>

      {activeTodos > 0
      && filterType !== FilterType.ACTIVE && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
