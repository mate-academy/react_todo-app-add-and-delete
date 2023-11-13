import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  todos: Todo[];
  showErrorWithDelay: (errorMessage: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  showErrorWithDelay,
  filterStatus,
  setFilterStatus,
}) => {
  const isCompleted = todos.find(item => item.completed);
  const todoNotCompleted = (): number => {
    return todos.filter(item => !item.completed).length;
  };

  const handleDeleteTodoCompleted = () => {
    showErrorWithDelay('Unable to update a todo');
    // const updatedTodos = todos.filter(item => item.completed !== true);
    // setTodos(updatedTodos);
  };

  return (
    todos.length > 0 ? (
    /* Hide the footer if there are no todos */
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${todoNotCompleted()}
          items left`}
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              { selected: filterStatus === 'All' },
            )}
            data-cy="FilterLinkAll"
            onClick={() => setFilterStatus(FilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              { selected: filterStatus === 'Active' },
            )}
            data-cy="FilterLinkActive"
            onClick={() => setFilterStatus(FilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              { selected: filterStatus === 'Completed' },
            )}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilterStatus(FilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>
        {/* don't show this button if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          style={isCompleted === undefined ? { opacity: 0 } : undefined}
          onClick={handleDeleteTodoCompleted}
        >
          Clear completed
        </button>
      </footer>
    ) : null
  );
};
