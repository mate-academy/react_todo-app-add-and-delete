import React, { useContext, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { TodosContext } from '../Store/Store';
import { FilterParams } from '../../types/FilterParams';

export const Footer: React.FC = React.memo(() => {
  const {
    todos,
    filter,
    setFilter,
    deleteTodo,
    pressClearAll,
    setPressClearAll,
  } = useContext(TodosContext);

  const itemsLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = () => {
    setPressClearAll(true);
  };

  useEffect(() => {
    if (pressClearAll) {
      const completedTodos = todos.filter(todo => todo.completed);

      Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    }
  }, [deleteTodo, pressClearAll, todos]);

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${itemsLeft} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link',
              { selected: filter === FilterParams.All })}
            data-cy="FilterLinkAll"
            onClick={() => setFilter(FilterParams.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link',
              { selected: filter === FilterParams.Active })}
            data-cy="FilterLinkActive"
            onClick={() => setFilter(FilterParams.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link',
              { selected: filter === FilterParams.Completed })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilter(FilterParams.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cn('todoapp__clear-completed',
            { disabled: !hasCompleted })}
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
});
