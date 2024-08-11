import { FC } from 'react';
import { Filters } from '../../types/Filters/Filters';
import {
  getActiveTodos,
  checkHasCompletedTodo,
} from '../../utils/helpers/filterService';
import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { useTodoActions } from '../../utils/hooks/useTodoActions';

export const TodoFilter: FC = () => {
  const { todos, setFilter, filter } = useTodoContext();
  const { clearCompletedTodos } = useTodoActions();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getActiveTodos(todos).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!checkHasCompletedTodo(todos)}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
