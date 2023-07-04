import cn from 'classnames';
import { FC } from 'react';
import { SortType } from '../enum/SortType';

interface Props {
  count: number;
  filters: string[];
  sortBy: string;
  isVisible: boolean;
  onSortType: (value: SortType) => void;
}

export const TodoFooter: FC<Props> = ({
  count,
  filters,
  sortBy,
  onSortType,
  isVisible,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${count} items left`}
    </span>

    {/* Active filter should have a 'selected' class */}
    <nav className="filter">
      {filters.map(filter => (
        <a
          key={filter}
          href="#/"
          className={cn('filter__link',
            { selected: sortBy === filter })}
          onClick={() => onSortType(filter as SortType)}
        >
          {filter}
        </a>
      ))}
    </nav>
    <button
      type="button"
      style={{
        visibility: isVisible
          ? 'hidden'
          : 'visible',
      }}
      className="todoapp__clear-completed"
      onClick={() => onDeleteCompeted()}
    >
      Clear completed
    </button>
  </footer>
);
