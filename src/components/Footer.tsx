import cn from 'classnames';
import { TodoFilter } from '../types/Filters';

type Props = {
  isAnyCompleted: boolean;
  activeTodosCount: number;
  onFilterChange: (newFilter: TodoFilter) => void;
  selectedFilter: TodoFilter;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  isAnyCompleted,
  activeTodosCount,
  onFilterChange,
  selectedFilter,
  onClearCompleted,
}) => {
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newFilter: TodoFilter,
  ) => {
    event.preventDefault();
    onFilterChange(newFilter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {Object.entries(TodoFilter).map(([key, value]) => (
          <a
            href={`#/${key}`}
            className={cn(
              'filter__link',
              { selected: selectedFilter === value },
            )}
            key={key}
            onClick={(event) => handleFilterChange(event, value)}
          >
            {key}
          </a>
        ))}
      </nav>

      {isAnyCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onClearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
