import classNames from 'classnames';
import { Filter } from '../../enums/Filter';

type Props = {
  unfinishedTodosLeft: number,
  activeFilter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  isAllFinished: boolean,
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  setFilter,
  activeFilter,
  unfinishedTodosLeft,
  isAllFinished,
  clearCompleted,
}) => {
  const handleFilterChange = (event: React.MouseEvent) => {
    const option = event.currentTarget.textContent;

    setFilter(option as Filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${unfinishedTodosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: activeFilter === Filter.ALL },
          )}
          onClick={handleFilterChange}
        >
          {Filter.ALL}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: activeFilter === Filter.ACTIVE },
          )}
          onClick={handleFilterChange}
        >
          {Filter.ACTIVE}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: activeFilter === Filter.COMPLETED },
          )}
          onClick={handleFilterChange}
        >
          {Filter.COMPLETED}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: isAllFinished ? 'hidden' : 'visible',
        }}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
