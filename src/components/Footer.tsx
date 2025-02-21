import { Filter } from '../types/Filter';
import cn from 'classnames';

type Props = {
  todosCount: number;
  isAllIncompleted: boolean;
  filter: Filter;
  clearCompleted: () => void;
  handleSetFilter: (val: Filter) => void;
};

export const Footer: React.FC<Props> = ({
  todosCount,
  isAllIncompleted,
  filter,
  clearCompleted,
  handleSetFilter,
}) => {
  const filterParams = [Filter.ALL, Filter.ACTIVE, Filter.COMPLETED];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterParams.map(el => {
          return (
            <a
              href="#/"
              onClick={() => handleSetFilter(el)}
              className={cn('filter__link', { selected: filter === el })}
              data-cy={`FilterLink${el}`}
              key={el}
            >
              {el}
            </a>
          );
        })}
      </nav>
      <button
        disabled={isAllIncompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
