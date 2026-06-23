import { FilterType } from '../App';
import { Filter } from './Filter';

type Props = {
  notCompletedCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  totalTodos: number;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  notCompletedCount,
  filter,
  setFilter,
  totalTodos,
  handleClearCompleted,
}) => {
  const hasCompleted = totalTodos - notCompletedCount > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedCount} items left
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
