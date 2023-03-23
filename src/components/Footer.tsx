import cn from 'classnames';
import { FilterCases } from '../types/FilterCases';
import { TodoFilter } from './TodoFilter';

type FooterProps = {
  amountOfItemsLeft: number,
  amountOfItems: number,
  currentFilter: FilterCases;
  onFilterChange: (filter: FilterCases) => void,
  onClear: () => void
};

export const Footer: React.FC<FooterProps> = ({
  amountOfItemsLeft,
  amountOfItems,
  currentFilter,
  onFilterChange,
  onClear,
}) => {
  const hasCompletedTodos = amountOfItems === amountOfItemsLeft;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${amountOfItemsLeft} items left`}
      </span>

      <TodoFilter
        currentFilter={currentFilter}
        onLinkClick={onFilterChange}
      />

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hide_button: hasCompletedTodos,
        })}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
