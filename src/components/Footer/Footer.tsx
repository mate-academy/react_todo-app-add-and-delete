import { SelectedFilter } from '../../types/SelectedFilter';
import cn from 'classnames';

type Props = {
  selected: SelectedFilter;
  itemCount: number;
  areNoneCompleted: boolean;
  onSelect?: (filterQuery: SelectedFilter) => void;
  onCompletedDelete?: () => void;
};

export const Footer: React.FC<Props> = ({
  selected,
  itemCount,
  areNoneCompleted,
  onCompletedDelete = () => {},
  onSelect = () => {},
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: selected === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => onSelect('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: selected === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => onSelect('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selected === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSelect('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onCompletedDelete()}
        disabled={areNoneCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
