import cn from 'classnames';
import { FilterCases } from '../types/FilterCases';
import { TodoFilter } from './TodoFilter';

type FooterProps = {
  amountOfItemsLeft: number,
  amountOfItems: number,
  currentFilter: FilterCases;
  handleLinkClick: (filter: FilterCases) => void,
  handleClearAll: () => void
};

export const Footer: React.FC<FooterProps> = ({
  amountOfItemsLeft,
  amountOfItems,
  currentFilter,
  handleLinkClick,
  handleClearAll,
}) => {
  const hasCompletedTodos = amountOfItems === amountOfItemsLeft;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${amountOfItemsLeft} items left`}
      </span>

      <TodoFilter
        currentFilter={currentFilter}
        onLinkClick={handleLinkClick}
      />

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            hide_button: hasCompletedTodos,
          },
        )}
        onClick={handleClearAll}
      >
        Clear completed
      </button>
    </footer>
  );
};
