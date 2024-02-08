/* eslint-disable react/style-prop-object */
/* eslint-disable import/no-cycle */
/* eslint-disable quote-props */
import { useContext } from 'react';
import { LoadingContext, TodosContext } from '../../TodosContext/TodosContext';
import { Status } from '../../types/Status';
import { reduceItems } from '../../services/reduceItems';
import { filterByStatus } from '../../services/filterByStatus';

interface FilterProps {
  onChangeStatus: (newStatus: Status) => void;
  status: Status
  onClearCompleted: (id: number) => void;
}

export const Filter: React.FC<FilterProps> = ({
  onChangeStatus,
  status,
  onClearCompleted,
}) => {
  const { todos } = useContext(TodosContext);
  const { startLoading } = useContext(LoadingContext);
  const handleStatusChange = (newStatus: Status) => {
    onChangeStatus(newStatus);
  };

  const handleClearCompleted = () => {
    const onlyActiveTodos = filterByStatus(todos, Status.Completed);

    return onlyActiveTodos.map(todo => {
      const { id } = todo;

      startLoading(id);

      return onClearCompleted(id);
    });
  };

  const todosLeft = todos.filter(todo => todo.id !== 0);
  const itemsLeft = reduceItems(todosLeft, false);

  const itemsDone = reduceItems(todos, true);
  const clearCompletedStyle: React.CSSProperties = {
    visibility: itemsDone > 0 ? 'visible' : 'hidden',
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={status === Status.All
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => handleStatusChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={status === Status.Active
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => handleStatusChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={status === Status.Completed
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => handleStatusChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        style={clearCompletedStyle}
        className="todoapp__clear-completed hidden"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
