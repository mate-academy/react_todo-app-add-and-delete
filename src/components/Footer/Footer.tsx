import { FilterParams } from '../../types/enums';
import { Filter } from '../Filter';

interface FooterProps {
  numberOfActiveTodos: number;
  selectedFilterParam: FilterParams;
  handleChangeFilterParam: (param: FilterParams) => void;
  clearCompletedTodos: () => void;
  hasCompletedTodo: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  numberOfActiveTodos,
  selectedFilterParam,
  handleChangeFilterParam,
  clearCompletedTodos,
  hasCompletedTodo,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${numberOfActiveTodos} item${numberOfActiveTodos !== 1 ? 's' : ''} left`}
    </span>

    <Filter
      selectedFilterParam={selectedFilterParam}
      handleChangeFilterParam={handleChangeFilterParam}
    />
    {/* /* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={clearCompletedTodos}
      disabled={!hasCompletedTodo}
    >
      Clear completed
    </button>
  </footer>
);
