import React, { useMemo } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  complitedFilter: Filter;
  changeComplitedFilter: (prop: Filter) => void;
  clearCompleted: () => void;
  todos: Todo[];
};

export const TodosFooter: React.FC<Props> = ({
  complitedFilter,
  changeComplitedFilter,
  clearCompleted,
  todos,
}) => {
  const activeTodosNumber = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const someTodosAreComplited = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            `filter__link ${complitedFilter === Filter.All && 'selected'}`
          }
          onClick={() => changeComplitedFilter(Filter.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            `filter__link ${complitedFilter === Filter.Active && 'selected'}`
          }
          onClick={() => changeComplitedFilter(Filter.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            `filter__link ${complitedFilter === Filter.Completed && 'selected'}`
          }
          onClick={() => changeComplitedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !someTodosAreComplited,
          },
        )}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
