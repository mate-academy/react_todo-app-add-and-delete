import { FC, memo } from 'react';
import cn from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';

type Props = {
  filterClick: (newOption: FilterTypes) => void,
  itemsCounter: number,
  filterOptions: FilterTypes[],
  filterType: FilterTypes
  handleClearCompletedClick: () => void
};

export const Footer: FC<Props> = memo(({
  filterClick,
  itemsCounter,
  filterOptions,
  filterType,
  handleClearCompletedClick,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsCounter} item${itemsCounter > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option}
            data-cy="FilterLinkAll"
            href="#/"
            className={cn(
              'filter__link',
              { selected: filterType === option },
            )}
            onClick={() => filterClick(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
});
