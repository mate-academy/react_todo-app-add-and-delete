import { Filters } from '../../types/FilterStatus';
import classNames from 'classnames';

interface Props {
  countActiveTodos: number;
  countCompletedTodos: number;
  statuses: Filters;
  setStatuses: React.Dispatch<React.SetStateAction<Filters>>;
  onRemoveAllCompleted: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({
  statuses,
  setStatuses,
  countActiveTodos,
  countCompletedTodos,
  onRemoveAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filter => {
          return (
            <a
              key={filter}
              href="#/"
              className={classNames('filter__link', {
                selected: statuses === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setStatuses(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>

      <button
        disabled={countCompletedTodos === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onRemoveAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
