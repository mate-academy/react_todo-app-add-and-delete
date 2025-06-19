import cn from 'classnames';
import { FILTERS } from '../../utils/constants';

type Props = {
  activeTodosCount: number;
  filtredField: FILTERS;
  onFiltr: (filtr: FILTERS) => void;
  hasCompleted: boolean;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filtredField,
  onFiltr,
  hasCompleted,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FILTERS).map(field => (
          <a
            key={field}
            href="#/"
            className={cn('filter__link', {
              selected: filtredField === field,
            })}
            data-cy={`FilterLink${field}`}
            onClick={() => onFiltr(field)}
          >
            {field}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onDeleteCompleted()}
        disabled={!hasCompleted ? true : false}
      >
        Clear completed
      </button>
    </footer>
  );
};
