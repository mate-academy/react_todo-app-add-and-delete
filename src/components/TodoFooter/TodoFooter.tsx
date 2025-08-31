import { FilterOptions } from '../../types/FilterOptions';
import cn from 'classnames';

type Props = {
  todosLeft: number;
  isThereCoplited: boolean;
  isInputProcessing: boolean;
  handleFilterOption: (option: FilterOptions) => void;
  handleDeleteCopmleted: () => void;
  filterOption: FilterOptions;
};

export const TodoFooter: React.FC<Props> = ({
  todosLeft,
  isThereCoplited,
  isInputProcessing,
  handleFilterOption,
  handleDeleteCopmleted,
  filterOption,
}) => {
  const todosCounter = isInputProcessing ? todosLeft - 1 : todosLeft;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterOption(FilterOptions.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterOption(FilterOptions.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterOption(FilterOptions.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isThereCoplited}
        onClick={handleDeleteCopmleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
