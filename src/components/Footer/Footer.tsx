import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { pluralize } from '../../utils/pluralize';

interface Props {
  setFilter: (q: Filter) => void;
  filterOption: Filter;
  todos: Todo[];
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  setFilter, filterOption, todos, deleteCompleted,
}) => {
  const completedTodo = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${pluralize(todosLeft, 'item')} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterOption === Filter.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: filterOption === Filter.Active },
            )
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: filterOption === Filter.Completed },
            )
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteCompleted}
        >
          {completedTodo && 'Clear completed'}
        </button>
      )}
    </footer>
  );
};
