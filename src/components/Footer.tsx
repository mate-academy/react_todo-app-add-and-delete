import { FilterType, Todo } from '../types/Types';

interface Props {
  todos: Todo[];
  filter: string;
  setFilter: (filter: string) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const filterLinks = [
    { type: FilterType.ALL, title: 'All', cy: 'FilterLinkAll', href: '#/' },
    {
      type: FilterType.ACTIVE,
      title: 'Active',
      cy: 'FilterLinkActive',
      href: '#/active',
    },
    {
      type: FilterType.COMPLETED,
      title: 'Completed',
      cy: 'FilterLinkCompleted',
      href: '#/completed',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.type}
            href={link.href}
            className={`filter__link ${filter === link.type ? 'selected' : ''}`}
            data-cy={link.cy}
            onClick={event => {
              event.preventDefault();
              setFilter(link.type);
            }}
          >
            {link.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
