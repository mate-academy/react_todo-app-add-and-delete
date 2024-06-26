import { SelectedFilter } from '../../types/SelectedFilter';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  itemsLeft: string;
  filter: SelectedFilter;
  onSetFilter: (filterType: SelectedFilter) => void;
  massDelete: Promise<void>;
  isOneActive: () => Todo[];
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filter,
  onSetFilter,
  massDelete,
  isOneActive,
}) => {
  return (
    <>
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === SelectedFilter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onSetFilter(SelectedFilter.ALL)}
        >
          {SelectedFilter.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === SelectedFilter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onSetFilter(SelectedFilter.ACTIVE)}
        >
          {SelectedFilter.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === SelectedFilter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSetFilter(SelectedFilter.COMPLETED)}
        >
          {SelectedFilter.COMPLETED}
        </a>
      </nav>
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => massDelete}
        disabled={isOneActive.length === 0}
      >
        {isOneActive.length > 0 && 'Clear completed'}
      </button>
    </>
  );
};
