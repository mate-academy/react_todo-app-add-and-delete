import React, { useContext } from 'react';
import cn from 'classnames';
import { TypeOfFilter } from '../../types/TypeOfFilters';
import { appContext } from '../Context/Context';

export const TodoFooter: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    deleteTodoHandler,
  } = useContext(appContext);

  const active = todos.filter(todo => !todo.completed);
  const completed = todos.filter(todo => todo.completed);
  const clearCompletedTodos = () => {
    completed.map(todo => deleteTodoHandler(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === TypeOfFilter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TypeOfFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === TypeOfFilter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TypeOfFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === TypeOfFilter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TypeOfFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {!!completed.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
