import { FilterType } from '../types/FilterType';
import { Filter } from './Filter';

interface FooterProps {
  filter: string,
  hasCompleted: boolean,
  todosLength: number,
  onRemoveCompleted: () => void;
  onFilterChange: (filterType: FilterType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  hasCompleted,
  todosLength,
  onRemoveCompleted,
  onFilterChange,
}) => {
  return (
    todosLength > 0 ? (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${todosLength} items left`}
        </span>

        <Filter
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <button
          type="button"
          className="todoapp__clear-completed"
          style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
          onClick={onRemoveCompleted}
        >
          Clear completed
        </button>
      </footer>
    ) : null
  );
};
