import { Filter } from '../Filter';
import { FilterParams } from '../../constants/filter';

type Props = {
  countOfActiveTodos: number;
  selectedFilterParam: FilterParams;
  handleChangeFilterParam: (param: FilterParams) => void;
  clearCompletedTodos: () => void;
  hasCompletedTodos: boolean;
};
export const Footer: React.FC<Props> = ({
  countOfActiveTodos,
  selectedFilterParam,
  handleChangeFilterParam,
  clearCompletedTodos,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfActiveTodos} item${countOfActiveTodos !== 1 ? 's' : ''} left`}
      </span>

      <Filter
        selectedFilterParam={selectedFilterParam}
        handleChangeFilterParam={handleChangeFilterParam}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
