import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectOption } from '../types/Todo';

type Props = {
  byFilter: SelectOption;
  setFilter: (status: SelectOption) => void;
  todos: Todo[];
  onClearCompleted: () => void;
  activeTodos: number;
  nonActiveTodos: number;
};

export const Footer: React.FC<Props> = ({
  byFilter,
  setFilter,
  activeTodos,
  nonActiveTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(SelectOption).map(filterBy => (
          <a
            key={filterBy}
            href={`#/${filterBy}`}
            className={classNames('filter__link', {
              selected: byFilter === filterBy,
            })}
            data-cy={`FilterLink${filterBy[0].toUpperCase() + filterBy.slice(1)}`}
            onClick={() => setFilter(filterBy)}
          >
            {filterBy[0].toUpperCase() + filterBy.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={nonActiveTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
