import React, { useContext, useState } from 'react';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const { todos, setTodos, incompleteCount, setFilter } =
    useContext(TodosContext);

  const [navClicked, setNavClicked] = useState({
    all: true,
    active: false,
    compleated: false,
  });

  const handleVisible = (status: FilterStatus) => {
    switch (status) {
      case FilterStatus.Active:
        setFilter(FilterStatus.Active);
        setNavClicked({ all: false, active: true, compleated: false });
        break;

      case FilterStatus.Completed:
        setFilter(FilterStatus.Completed);
        setNavClicked({ all: false, active: false, compleated: true });
        break;

      case FilterStatus.All:
        setFilter(FilterStatus.All);
        setNavClicked({ all: true, active: false, compleated: false });
        break;

      default:
        setTodos(todos);
    }
  };

  const handleClearCompleted = () => {
    const justIncomplete = todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return !todo.completed;
    });

    setTodos(justIncomplete);
  };

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${incompleteCount} items left`}
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: navClicked.all,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleVisible(FilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: navClicked.active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => handleVisible(FilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: navClicked.compleated,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => handleVisible(FilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!(todos.length - incompleteCount > 0)}
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
