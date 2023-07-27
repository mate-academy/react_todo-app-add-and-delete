import classNames from 'classnames';
import { FilterParams } from '../../types/FilterParams';
import { Todo } from '../../types/Todo';

interface Props {
  filter: FilterParams,
  setFilter: (newFilter: FilterParams) => void,
  clearCompleted: () => void,
  todos: Todo[],
}

export const TodoFilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  clearCompleted,
  todos,
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
          className={classNames('filter__link', {
            selected: filter === FilterParams.all,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFilter(FilterParams.all);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterParams.active,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFilter(FilterParams.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterParams.completed,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFilter(FilterParams.completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        onClick={() => clearCompleted()}
        type="button"
        style={{
          visibility: todos.every(todo => !todo.completed)
            ? 'hidden'
            : 'visible',
        }}
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
