import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../Store/Store';
import { FilterParams } from '../../types/FilterParams';

export const Footer: React.FC = React.memo(() => {
  const {
    todos, setTodos, filter, setFilter, deleteTodo,
  } = useContext(TodosContext);

  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const clearCompleted = todos.filter(todo => !todo.completed);

    setTodos(clearCompleted);

    todos.filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id));
  };

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
