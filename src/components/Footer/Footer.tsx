import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  completedTodos:Todo[],
  activeTodos: number,
  filterType: FilterType,
  onSetFilterType: (filter: FilterType) => void,
  onDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  onDeleteCompletedTodos,
  activeTodos,
  filterType,
  onSetFilterType,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.All,
            },
          )}
          onClick={() => {
            if (filterType !== FilterType.All) {
              onSetFilterType(FilterType.All);
            }
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Active,
            },
          )}
          onClick={() => {
            if (filterType !== FilterType.Active) {
              onSetFilterType(FilterType.Active);
            }
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Completed,
            },
          )}
          onClick={() => {
            if (filterType !== FilterType.Completed) {
              onSetFilterType(FilterType.Completed);
            }
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodos}
      >
        {completedTodos.length > 0 && (
          'Clear completed'
        )}
      </button>
    </footer>
  );
};
