import cn from 'classnames';
import { FilterState } from '../../types/FilterState';

interface FooterProps {
  itemsLeft: number;
  filterState: FilterState;
  onFilter: (filterState: FilterState) => void;
  disableClearButton: boolean;
  onClearCompleted: () => void;
}

const filterStates: FilterState[] = Object.values(FilterState);

export const Footer: React.FC<FooterProps> = ({
  itemsLeft,
  filterState,
  onFilter,
  disableClearButton,
  onClearCompleted,
}) => {
  return (
    <>
      {/* Hide the footer if there are no todos */}
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeft} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {filterStates.map(state => (
            <a
              key={state}
              href={`#/${state === FilterState.All ? '' : state.toLowerCase()}`}
              className={cn('filter__link', {
                selected: filterState === state,
              })}
              data-cy={`FilterLink${state}`}
              onClick={() => onFilter(state)}
            >
              {state}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={disableClearButton}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
