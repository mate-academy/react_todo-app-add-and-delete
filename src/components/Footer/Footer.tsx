import { FiltersEnum } from '../../utils/FiltersEnum';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export interface TodoFooterProps {
  isClearDisabled: boolean;
  itemsLeft: number;
  clearCompleted: () => void;
  setSelectedFilter: (filter: FiltersEnum) => void;
  selectedFilter: FiltersEnum;
}

export const Footer: React.FC<TodoFooterProps> = ({
  isClearDisabled,
  itemsLeft,
  clearCompleted,
  setSelectedFilter,
  selectedFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <TodoFilter
        setSelectedFilter={setSelectedFilter}
        selectedFilter={selectedFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={isClearDisabled}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
