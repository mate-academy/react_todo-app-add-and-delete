import { FilterType } from '../../types/FilterType';
import cn from 'classnames';

interface Props {
  notCompletedTodosCount: number;
  setQuery: (value: React.SetStateAction<FilterType>) => void;
  query: FilterType;
  clearCompleted: () => void;
  completedTodoLength: number;
}

export const Footer = ({
  notCompletedTodosCount,
  setQuery,
  query,
  clearCompleted,
  completedTodoLength,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(t => {
          return (
            <a
              key={t}
              onClick={() => setQuery(t)}
              href={`#/${t}`}
              className={cn('filter__link', {
                selected: query === t,
              })}
              data-cy={`FilterLink${t}`}
            >
              {t}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodoLength === 0}
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
