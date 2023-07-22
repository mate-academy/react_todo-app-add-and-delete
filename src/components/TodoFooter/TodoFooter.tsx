import React from 'react';
import cn from 'classnames';
import { Filter } from '../../enums/Filter';

type Props = {
  filter: Filter,
  showClearButton: boolean,
  itemsCount: number;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  deleteAllTodos: () => Promise<void>
};
const TodoFooter: React.FC<Props> = React.memo(({
  setFilter,
  filter,
  showClearButton,
  itemsCount,
  deleteAllTodos,
}) => {
  const onClickHandler = (value: Filter) => () => {
    setFilter(value);
  };

  const countText = `${itemsCount} item${itemsCount > 1 ? 's' : ''} left`;

  const clearCompletedHandler = () => deleteAllTodos();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {countText}
      </span>

      <nav className="filter">
        <a
          href="src/components/TodoHeader#/"
          className={cn(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          onClick={onClickHandler(Filter.All)}
        >
          All
        </a>

        <a
          href="src/components/TodoHeader#/active"
          className={cn(
            'filter__link',
            { selected: filter === Filter.Active },
          )}
          onClick={onClickHandler(Filter.Active)}
        >
          Active
        </a>

        <a
          href="src/components/TodoHeader#/completed"
          className={cn(
            'filter__link',
            { selected: filter === Filter.Completed },
          )}
          onClick={onClickHandler(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        onClick={clearCompletedHandler}
        className="todoapp__clear-completed"
        style={{ visibility: showClearButton ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
});

export { TodoFooter };
