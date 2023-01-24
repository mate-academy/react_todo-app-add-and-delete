import { NavLink } from 'react-router-dom';
import cn from 'classnames';

export const Filter = () => (
  <nav className="filter" data-cy="Filter">
    <NavLink
      data-cy="FilterLinkAll"
      to="/"
      className={({ isActive }) => (
        cn('filter__link', {
          selected: isActive,
        })
      )}
    >
      All
    </NavLink>

    <NavLink
      data-cy="FilterLinkActive"
      to="/active"
      className={({ isActive }) => (
        cn('filter__link', {
          selected: isActive,
        })
      )}
    >
      Active
    </NavLink>

    <NavLink
      data-cy="FilterLinkCompleted"
      to="/completed"
      className={({ isActive }) => (
        cn('filter__link', {
          selected: isActive,
        })
      )}
    >
      Completed
    </NavLink>
  </nav>
);
