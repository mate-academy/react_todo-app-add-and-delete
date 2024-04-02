import classNames from 'classnames';
import { FilteredTodos } from '../enums/FilteredTodos';

interface Props {
  setFilterSelected: (filterSelected: FilteredTodos) => void;
  filterSelected: FilteredTodos;
}

export const TodoFilter: React.FC<Props> = ({
  setFilterSelected,
  filterSelected,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterSelected === FilteredTodos.all,
        })}
        onClick={() => setFilterSelected(FilteredTodos.all)}
        data-cy="FilterLinkAll"
      >
        {FilteredTodos.all}
      </a>

      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterSelected === FilteredTodos.active,
        })}
        onClick={() => setFilterSelected(FilteredTodos.active)}
        data-cy="FilterLinkActive"
      >
        {FilteredTodos.active}
      </a>

      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterSelected === FilteredTodos.completed,
        })}
        onClick={() => setFilterSelected(FilteredTodos.completed)}
        data-cy="FilterLinkCompleted"
      >
        {FilteredTodos.completed}
      </a>
    </nav>
  );
};
