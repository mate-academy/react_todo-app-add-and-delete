import classNames from 'classnames';
import { StatusState } from '../../types/StatusState';

type Props = {
  filterTodo: StatusState;
  onChangeFilter: (newFilter: StatusState) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filterTodo,
  onChangeFilter,
}) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filterTodo === StatusState.All,
      })}
      onClick={() => onChangeFilter(StatusState.All)}
      data-cy="FilterLinkAll"
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filterTodo === StatusState.Active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => onChangeFilter(StatusState.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filterTodo === StatusState.Completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => onChangeFilter(StatusState.Completed)}
    >
      Completed
    </a>
  </nav>
);
