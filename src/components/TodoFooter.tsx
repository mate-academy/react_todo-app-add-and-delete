import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  currentFilter: Filters;
  onFilter: (currentFilter: Filters) => void;
  onDelete: (todoIds: number[]) => void;
};

const filters = [
  {
    name: 'All',
    href: '#/',
    filter: Filters.All,
    dataCy: 'FilterLinkAll',
  },

  {
    name: 'Active',
    href: '#/active',
    filter: Filters.Active,
    dataCy: 'FilterLinkActive',
  },

  {
    name: 'Completed',
    href: '#/completed',
    filter: Filters.Completed,
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  todos,
  currentFilter,
  onFilter,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    const todosCompletedId = completedTodos.map(todo => todo.id);

    onDelete(todosCompletedId);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ name, href, filter, dataCy }) => (
          <a
            key={filter}
            href={href}
            className={cn('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={dataCy}
            onClick={() => onFilter(filter)}
          >
            {name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
