import classNames from 'classnames';
import { Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavLink } from 'react-router-dom';

const filters = [
  { to: '/', label: 'All', dataCy: 'FilterLinkAll' },
  { to: '/active', label: 'Active', dataCy: 'FilterLinkActive' },
  { to: '/completed', label: 'Completed', dataCy: 'FilterLinkCompleted' },
];

export const Footer = ({
  todos,
  onClearCompleted,
}: {
  todos: Todo[];
  onClearCompleted: (ids: number[]) => void;
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {todos.filter(todo => !todo.completed).length} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {filters.map(({ to, label, dataCy }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            classNames('filter__link', { selected: isActive })
          }
          data-cy={dataCy}
        >
          {label}
        </NavLink>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.filter(todo => todo.completed).length === 0}
      onClick={() =>
        onClearCompleted(
          todos.filter(todo => todo.completed).map(todo => todo.id),
        )
      }
    >
      Clear completed
    </button>
  </footer>
);
