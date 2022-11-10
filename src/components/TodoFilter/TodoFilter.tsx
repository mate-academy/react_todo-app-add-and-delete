import React, { useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilteringMethod } from '../../types/FilteringMethod';

type Props = {
  todos: Todo[];
  filteringMethod: FilteringMethod;
  handleStatusSelect: (status: FilteringMethod) => void;
  removeCompleted: () => void;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  filteringMethod,
  handleStatusSelect,
  removeCompleted,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filteringMethod === FilteringMethod.All },
          )}
          onClick={() => handleStatusSelect(FilteringMethod.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filteringMethod === FilteringMethod.Active },
          )}
          onClick={() => handleStatusSelect(FilteringMethod.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filteringMethod === FilteringMethod.Completed },
          )}
          onClick={() => handleStatusSelect(FilteringMethod.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'has-text-white': todos.length === todosLeft,
        })}
        onClick={() => removeCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
