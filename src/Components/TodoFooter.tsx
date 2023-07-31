import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface Props {
  filterType: Filter;
  setFilterType: (type: Filter) => void;
  todos: Todo[];
}

export const TodoFooter: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
}) => {
  const completedTodoCount = todos.filter(todo => todo.completed).length;
  const uncompletedTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodoCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === Filter.All,
          })}
          onClick={() => setFilterType(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filter.Active,
          })}
          onClick={() => setFilterType(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          onClick={() => setFilterType(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': completedTodoCount === 0 })}
      >
        Clear completed
      </button>
    </footer>
  );
};
