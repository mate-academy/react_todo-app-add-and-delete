import cn from 'classnames';
import { FilterTypes } from '../../types/FIlterTypes';

type Props = {
  filterType: FilterTypes,
  handleFilterType: (filter: FilterTypes) => void,
  hasCompletedTodos: boolean,
  deleteAllCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  filterType, handleFilterType, hasCompletedTodos, deleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: FilterTypes.ALL === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: FilterTypes.ACTIVE === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: FilterTypes.COMPLETED === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !hasCompletedTodos,
        })}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
