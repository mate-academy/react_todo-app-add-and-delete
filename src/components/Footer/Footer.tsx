import classNames from 'classnames';
import { FieldForSorting } from '../../types/Todo';

type Props = {
  fieldForSorting: FieldForSorting;
  selectFieldForSorting: (field: FieldForSorting) => void;
  counterActiveTodos: number;
  deleteCompletedTodos: () => void;
  length: number;
};

export const Footer: React.FC<Props> = ({
  fieldForSorting,
  selectFieldForSorting,
  counterActiveTodos,
  deleteCompletedTodos,
  length,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${counterActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: fieldForSorting === FieldForSorting.All,
          })}
          onClick={() => selectFieldForSorting(FieldForSorting.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: fieldForSorting === FieldForSorting.Active,
          })}
          onClick={() => selectFieldForSorting(FieldForSorting.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: fieldForSorting === FieldForSorting.Completed,
          })}
          onClick={() => selectFieldForSorting(FieldForSorting.Completed)}
        >
          Completed
        </a>
      </nav>

      {length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
