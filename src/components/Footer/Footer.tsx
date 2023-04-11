import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../utils/filterTypes';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  onFilterTypeChange: (newFilterMode: FilterType) => void;
  onRemoveCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onFilterTypeChange,
  onRemoveCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

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
              onFilterTypeChange(FilterType.All);
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
              onFilterTypeChange(FilterType.Active);
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
              onFilterTypeChange(FilterType.Completed);
            }
          }}
        >
          Completed
        </a>
      </nav>

      {completedTodos
        ? (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={onRemoveCompleted}
          >
            Clear completed
          </button>
        )
        : (
          <span />
        )}
    </footer>
  );
};
