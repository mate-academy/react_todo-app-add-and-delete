import classNames from 'classnames';
import { Filter } from '../../types/FilterEnum';

interface Props {
  todoCounter: number;
  filterTodos: Filter;
  setFilterTodos: (filter: Filter) => void;
}

export const TodoFooter: React.FC<Props> = ({
  todoCounter,
  filterTodos,
  setFilterTodos,
}) => {
  const handleFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    switch (event.currentTarget.hash) {
      case '#/active':
        setFilterTodos(Filter.ACTIVE);
        break;
      case '#/completed':
        setFilterTodos(Filter.COMPLETED);
        break;
      default:
        setFilterTodos(Filter.ALL);
        break;
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoCounter} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.ALL,
          })}
          onClick={handleFilter}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.ACTIVE,
          })}
          onClick={handleFilter}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterTodos === Filter.COMPLETED,
          })}
          onClick={handleFilter}
        >
          Completed
        </a>
      </nav>

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
