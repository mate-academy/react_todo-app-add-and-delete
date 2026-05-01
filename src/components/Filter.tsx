import classNames from 'classnames';
import { FilterValues } from '../types/FilterValuesEnum';

type Props = {
  todoStatus: FilterValues;
  setTodoStatus: (value: FilterValues) => void;
};

export const Filter = ({ todoStatus, setTodoStatus }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: todoStatus === FilterValues.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setTodoStatus(FilterValues.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: todoStatus === FilterValues.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setTodoStatus(FilterValues.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: todoStatus === FilterValues.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setTodoStatus(FilterValues.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
