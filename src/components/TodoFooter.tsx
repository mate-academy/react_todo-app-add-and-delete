import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterValue } from '../types/FilterValue';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todos: Todo[];
  filterChange: (filter: FilterValue) => void;
  filterValue: FilterValue;
  clearCompleted: () => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterChange,
  filterValue,
  clearCompleted,
  setTodos,
  setError,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const [clearingCompleted, setClearingCompleted] = useState(false);

  const handleClearCompleted = async () => {
    try {
      setClearingCompleted(true);
      const deletedTodoId = await clearCompleted();

      if (deletedTodoId !== undefined) {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter((todo) => todo.id === deletedTodoId));
      }
    } catch (error) {
      setError(ErrorType.DeleteTodoError);
    } finally {
      setClearingCompleted(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(FilterValue.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(FilterValue.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(FilterValue.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* Enable the button only if there are completed todos */}
      {completedTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            'clearing-completed': clearingCompleted,
          })}
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          {clearingCompleted ? 'Clearing...' : 'Clear completed'}
        </button>
      )}
    </footer>
  );
};
