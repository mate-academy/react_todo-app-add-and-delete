import { useContext } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

export const Footer: React.FC = () => {
  const states = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const todosLeft = states.todos.filter(t => !t.completed);

  function handleClick(filter: Filter) {
    dispatch({ type: 'setFilter', payload: filter });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: states.filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleClick(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: states.filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleClick(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: states.filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleClick(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={states.todos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
