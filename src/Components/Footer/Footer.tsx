import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type FooterProps = {
  handleFilter: (filteringCriteria: Filter) => void;
  todos: Todo[];
  filter: string;
  noCompletedTodos: boolean;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  handleFilter,
  todos,
  filter,
  noCompletedTodos,
  handleClearCompleted,
}) => {
  const getNumber = () => {
    return todos.filter(todo => todo.completed !== true).length;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getNumber()} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue}`}
            className={classNames('filter__link ', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`}
            onClick={() => handleFilter(filterValue)}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={noCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
