import { Todo } from '../types/Todo';
import { FilterType } from '../types/Filter';

type Props = {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {['all', 'active', 'completed'].map(type => (
          <a
            href="#/"
            key={type}
            className={`filter__link ${filter === type ? 'selected' : ''}`}
            data-cy={`FilterLink${type[0].toUpperCase()}${type.slice(1)}`}
            onClick={e => {
              e.preventDefault();
              setFilter(type as FilterType);
            }}
          >
            {type[0].toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
