import { useCallback, useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import classNames from 'classnames';
import { FilterType } from '../App';

export interface FooterType {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  deleteAll: () => void;
}

export const Footer: React.FC<FooterType> = ({
  filter,
  setFilter,
  deleteAll,
}) => {
  const { todos } = useContext(TodoContext);

  const establishFilter = useCallback(
    (
      filterName: FilterType,
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      setFilter(filterName);
    },
    [setFilter],
  );

  const todosLength = todos.filter(x => !x.completed && x.id !== 0).length;
  const hasCompleted = todos.find(x => x.completed) === undefined;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLength} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={'FilterLink' + value}
            onClick={e => establishFilter(value, e)}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAll}
        disabled={hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
