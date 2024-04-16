import React, { useContext } from 'react';
import { DispatchContext, StateContext } from '../context/ContextReducer';
import cn from 'classnames';

export const TodoAppFooter: React.FC = () => {
  const { select, totalLength } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const itemLeft = totalLength.filter(todo => !todo.completed);
  const clear = totalLength.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => dispatch({ type: 'setSelect', value: 'All' })}
          href="#/"
          className={cn('filter__link', { selected: select === 'All' })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => dispatch({ type: 'setSelect', value: 'Active' })}
          href="#/active"
          className={cn('filter__link', { selected: select === 'Active' })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => dispatch({ type: 'setSelect', value: 'Completed' })}
          href="#/completed"
          className={cn('filter__link', { selected: select === 'Completed' })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        onClick={() => dispatch({ type: 'deleteAllCompleted' })}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!clear}
      >
        Clear completed
      </button>
    </footer>
  );
};
