import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import { FilterValues } from '../../types/FilterValues';
import { filter } from '../../signals/filter-signals';
import {
  activeTodosCounter, completedTodosCounter, isError, todos, todosToDelete,
} from '../../signals';
import { deleteTodo } from '../../api/todos';
import { ErrorValues } from '../../types/ErrorValues';

export const Footer = () => {
  useSignals();

  // const activeItemsLeft = `${activeTodosCounter.value} ${activeTodosCounter.value === 1 ? 'item left' : 'items left'}`;
  const activeItemsLeft = `${activeTodosCounter.value} items left`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.currentTarget.innerText) {
      case FilterValues.All:
        filter.value = FilterValues.All;
        break;

      case FilterValues.Active:
        filter.value = FilterValues.Active;
        break;

      case FilterValues.Completed:
        filter.value = FilterValues.Completed;
        break;

      default:
        break;
    }
  };

  const handleClearCompleted = () => {
    todos.value.forEach((todo) => {
      if (todo.completed) {
        todosToDelete.value = [...todosToDelete.value, todo.id];
        deleteTodo(todo.id)
          .then(() => {
            todos.value = todos.value.filter((t) => t.id !== todo.id);
            todosToDelete.value = todosToDelete.value
              .filter((t) => t !== todo.id);
          })
          .catch(() => {
            isError.value = ErrorValues.delete;
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeItemsLeft}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filter.value === FilterValues.All })}
          data-cy="FilterLinkAll"
          onClick={handleClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filter.value === FilterValues.Active })}
          data-cy="FilterLinkActive"
          onClick={handleClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter.value === FilterValues.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={handleClick}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCounter.value}
        style={{
          visibility: completedTodosCounter.value
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
