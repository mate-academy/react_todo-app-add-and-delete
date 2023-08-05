import classNames from 'classnames';
import { FilterParams } from '../types/FilteredParams';
import { Todo } from '../types/Todo';

interface Filter {
  filter: FilterParams,
  setFilter: (newFilter: FilterParams) => void,
  todos: Todo[],
  setClearCompletedTodo: () => void,
}

export const TodoFilterBar: React.FC<Filter> = ({
  filter,
  setFilter,
  todos,
  setClearCompletedTodo,
}) => {
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  function handleClickAll(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setFilter(FilterParams.all);
  }

  function handleClickActive(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setFilter(FilterParams.active);
  }

  function handleClickCompleted(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setFilter(FilterParams.completed);
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterParams.all,
          })}
          onClick={handleClickAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterParams.active,
          })}
          onClick={handleClickActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterParams.completed,
          })}
          onClick={handleClickCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        onClick={() => setClearCompletedTodo()}
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
