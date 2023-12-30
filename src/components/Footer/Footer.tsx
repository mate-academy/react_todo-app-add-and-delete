import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import { FilterValues } from '../../types/FilterValues';
import { filter } from '../../signals/filter-signals';
import { activeTodosCounter } from '../../signals';

export const Footer = () => {
  useSignals();

  const activeItemsLeft = `${activeTodosCounter.value} ${activeTodosCounter.value === 1 ? 'item left' : 'items left'}`;

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
      >
        Clear completed
      </button>
    </footer>
  );
};
