import classNames from 'classnames';
import { FilterTypes } from '../../enum/FilterTypes';
import { Todo } from '../../types/Todo';
import { FC, useState } from 'react';

interface Props {
  todos: Todo[];
  handleFilterChange: (filter: FilterTypes) => void;
  deleteCompletedTodos: (list: Todo[]) => void;
}

export const FilterFooter: FC<Props> = ({
  todos,
  handleFilterChange,
  deleteCompletedTodos,
}) => {
  const [filter, setFilter] = useState(FilterTypes.All);

  const NotCompletedTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const setFilterType = (filterType: FilterTypes) => {
    setFilter(filterType);
    handleFilterChange(filterType);
  };

  const isSelectedFilter = (filterType: FilterTypes) =>
    filter === FilterTypes[filterType];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {NotCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: isSelectedFilter(FilterTypes.All),
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterType(FilterTypes.All)}
        >
          {FilterTypes.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: isSelectedFilter(FilterTypes.Active),
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterType(FilterTypes.Active)}
        >
          {FilterTypes.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: isSelectedFilter(FilterTypes.Completed),
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterType(FilterTypes.Completed)}
        >
          {FilterTypes.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={NotCompletedTodos === todos.length}
        onClick={() => deleteCompletedTodos(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
