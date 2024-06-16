import { useContext } from 'react';
import { TodosContext } from '../../stor/Context';
import classNames from 'classnames';

type Props = {};

enum FilerType {
  FILTER_TODO_ALL = 'all',
  FILTER_TODO_ACTIVE = 'active',
  FILTER_TODO_COMPLETED = 'completed',
}

export const Footer: React.FC<Props> = () => {
  const {
    todos,
    filterField,
    setFilterField,
    clearCompleted,
    stateClearBtn,
    setStateClearBtn,
  } = useContext(TodosContext);

  if (todos.find(todo => todo.completed)) {
    setStateClearBtn(false);
  } else {
    setStateClearBtn(true);
  }

  const count = todos.filter(todo => todo.completed === false).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterField === FilerType.FILTER_TODO_ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterField(FilerType.FILTER_TODO_ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterField === FilerType.FILTER_TODO_ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterField(FilerType.FILTER_TODO_ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterField === FilerType.FILTER_TODO_COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterField(FilerType.FILTER_TODO_COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={stateClearBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};
