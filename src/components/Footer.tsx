import { Todo } from '../types/Todo';

type Props = {
  completedTodos: Todo[];
  itemsLeft: number;
  selectedFilter: string;
  handleSelectedFilter: (filter: string) => void;
  clearCompletedTodos: () => void;
};

const filters = ['all', 'active', 'completed'];

const Footer: React.FC<Props> = ({
  completedTodos,
  itemsLeft,
  selectedFilter,
  handleSelectedFilter,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft && itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => {
          const uppercasedFilter =
            filter.charAt(0).toUpperCase() + filter.slice(1, filter.length);

          return (
            <a
              href={`#/${filter}`}
              className={`filter__link ${selectedFilter === filter && 'selected'}`}
              data-cy={`FilterLink` + uppercasedFilter}
              onClick={() => handleSelectedFilter(filter)}
              key={filter}
            >
              {uppercasedFilter}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
