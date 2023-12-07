import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  onSetFilter: (filter: Filter) => void,
  isCompleted: boolean,
  filterStatus: Filter,
  onDeleteTodo: (id: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  onSetFilter,
  isCompleted,
  filterStatus,
  onDeleteTodo,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  const chooseFilter = (status: Filter) => {
    switch (status) {
      case 'Active':
        onSetFilter(Filter.Active);
        break;
      case 'Completed':
        onSetFilter(Filter.Completed);
        break;
      default:
        onSetFilter(Filter.All);
        break;
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => chooseFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => chooseFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => chooseFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {isCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
