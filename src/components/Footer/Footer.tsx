import classNames from 'classnames';
import { Filter } from '../../App';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  changeFilter: (value: Filter) => void;
  clearCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  todos,
  filter,
  changeFilter,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link ', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link ', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link ', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
