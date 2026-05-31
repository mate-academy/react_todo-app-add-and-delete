import { Todo } from '../../types/Todo';
import { TodosFilter } from '../../types/TodosFilter';
import { FilterButton } from '../FilterButton';
import './footer.scss';

type Props = {
  todosLeftToComplete: number;
  todosFilters: TodosFilter[];
  selectedFilter: TodosFilter;
  onHandleFilterButtonClick: (filter: TodosFilter) => void;
  onSetSelectedFilter: (filter: TodosFilter) => void;
  todosFromServer: Todo[];
  onClearCompletedCLick?: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLeftToComplete,
  todosFilters,
  selectedFilter,
  onHandleFilterButtonClick,
  onSetSelectedFilter,
  todosFromServer,
  onClearCompletedCLick = () => {},
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeftToComplete} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {todosFilters.map(filter => (
          <FilterButton
            key={filter}
            filter={filter}
            selectedFilter={selectedFilter}
            onClick={() => {
              onHandleFilterButtonClick(filter);
              onSetSelectedFilter(filter);
            }}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!(todosLeftToComplete < todosFromServer.length)}
        onClick={onClearCompletedCLick}
      >
        Clear completed
      </button>
    </footer>
  );
};
