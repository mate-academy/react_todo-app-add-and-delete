// .. footer.tsx

import { Todo } from '../types/Todo';
import type { FilterBy } from '../types/ErrorMessages';
import type { FilterLink } from '../types/FilterLink';

interface FooterBottomProps {
  todos: Todo[];
  clearCompleted: () => void;
  setFilterBy: (value: FilterBy) => void;
  filterBy: FilterBy;
}

const filterLinks: FilterLink[] = [
  {
    id: 1,
    href: '#/',
    dataCy: 'FilterLinkAll',
    filterBy: 'all',
    title: 'All',
  },
  {
    id: 2,
    href: '#/active',
    dataCy: 'FilterLinkActive',
    filterBy: 'active',
    title: 'Active',
  },
  {
    id: 3,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
    filterBy: 'completed',
    title: 'Completed',
  },
];

export const FooterBottom = ({
  todos,
  clearCompleted,
  setFilterBy,
  filterBy,
}: FooterBottomProps) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => {
          return (
            <a
              key={link.id}
              href={link.href}
              className={
                filterBy === link.filterBy
                  ? 'filter__link selected'
                  : 'filter__link'
              }
              data-cy={link.dataCy}
              onClick={() => setFilterBy(link.filterBy)}
            >
              {link.title}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
