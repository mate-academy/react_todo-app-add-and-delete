import { useContext } from 'react';
import classnames from 'classnames';

import { Status } from '../../types/Status';
import { FilterContext } from '../../context/FilterContext';
import { TodoContext } from '../../context/TodoContext';

export const TodoFooter = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const { selectedFilter, setSelectedFilter } = useContext(FilterContext);

  const clearCompleted = () => {
    const activeTodos = todos.filter(({ completed }) => !completed);

    setTodos(activeTodos);
  };

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(({ completed }) => !completed).length} items left`}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.All,
            },
          )}
          onClick={() => setSelectedFilter(Status.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Active,
            },
          )}
          onClick={() => setSelectedFilter(Status.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Completed,
            },
          )}
          onClick={() => setSelectedFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {!!todos.filter(({ completed }) => completed).length && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
