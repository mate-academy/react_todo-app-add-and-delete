import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  countActiveTodos: number;
  countCompletedTodos: number;
  setFilterValue: (value: FilterStatus) => void;
  onClearCompleted: () => void;
  filterBy: FilterStatus;
};

export const Footer: React.FC<Props> = ({
  countActiveTodos,
  countCompletedTodos,
  setFilterValue,
  onClearCompleted,
  filterBy,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav
        className="filter"
        data-cy="Filter"
        onClick={event =>
          setFilterValue((event.target as HTMLAnchorElement).innerText)
        }
      >
        {Object.values(FilterStatus).map(link => {
          return (
            <a
              href={`#/${link !== 'All' ? link.toLowerCase() : ''}`}
              className={classNames('filter__link', {
                selected: filterBy === link,
              })}
              data-cy={`FilterLink${link}`}
              key={link}
            >
              {link}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={countCompletedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
