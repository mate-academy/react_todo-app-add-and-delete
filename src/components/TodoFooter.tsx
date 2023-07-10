import cn from 'classnames';
import { FC } from 'react';
import { SortType } from '../enum/SortType';

interface Props {
  count: number;
  filters: string[];
  sortBy: string;
  isVisible: boolean;
  onSortType: (value: SortType) => void;
  onDeleteCompleted: () => void;
}

export const TodoFooter: FC<Props> = ({
  count,
  filters,
  sortBy,
  onSortType,
  isVisible,
  onDeleteCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${count} items left`}
    </span>

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
      onClick={onDeleteCompleted}
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
