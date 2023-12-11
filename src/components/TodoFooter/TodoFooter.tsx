import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  onSetFilter: (filter: Filter) => void,
  filterStatus: Filter,
  onDeleteTodo: (id: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  onSetFilter,
  filterStatus,
  onDeleteTodo,
}) => {
  const isThereCompleted = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const chooseFilter = (status: Filter) => {
    switch (status) {
      case Filter.Active:
        onSetFilter(Filter.Active);
        break;
      case Filter.Completed:
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
            selected: filterStatus === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => chooseFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => chooseFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => chooseFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {isThereCompleted && (
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
