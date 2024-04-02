import cn from 'classnames';

import { StatesOfFilter } from '../../types/StatesOfFilter';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

type Props = {
  onSetFilter: (state: StatesOfFilter) => void;
  completedTodoCounts: number;
  activeTodoCounts: number;
  selectedFilter: StatesOfFilter;
  onDeleteCompletedPosts: () => void;
};

export const Footer: React.FC<Props> = ({
  onSetFilter,
  completedTodoCounts,
  activeTodoCounts,
  selectedFilter,
  onDeleteCompletedPosts,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCounts} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(StatesOfFilter).map(state => (
          <a
            key={state}
            href={`#/${state}`}
            className={cn('filter__link', {
              selected: selectedFilter === state,
            })}
            data-cy={`FilterLink${capitalizeFirstLetter(state)}`}
            onClick={() => {
              onSetFilter(state);
            }}
          >
            {capitalizeFirstLetter(state)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompletedPosts}
        disabled={!completedTodoCounts}
      >
        Clear completed
      </button>
    </footer>
  );
};
