import classNames from 'classnames';
import { FilterStatus } from '../../types/enums';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  quantityActiveTasks: number;
  activeFilterStatus: string;
  handleChangeFilter: (type: FilterStatus) => void;
  handleDeleteAllTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  quantityActiveTasks,
  activeFilterStatus,
  handleChangeFilter,
  handleDeleteAllTodos,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${quantityActiveTasks} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleChangeFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleChangeFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleChangeFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={quantityActiveTasks === todos.length}
        onClick={handleDeleteAllTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
