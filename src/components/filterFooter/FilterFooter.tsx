import classNames from 'classnames';
import { FilterTypes } from '../../enum/FilterTypes';
import { FC, useState } from 'react';
import { useTodosContext } from '../../context/context';

interface Props {
  handleFilterChange: (filter: FilterTypes) => void;
}

export const FilterFooter: FC<Props> = ({ handleFilterChange }) => {
  const { todos, handleDelete } = useTodosContext();

  const [filter, setFilter] = useState(FilterTypes.All);

  const NotCompletedTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const deleteAllCompletedTodos = () => {
    for (const todo of completedTodos) {
      handleDelete(todo.id);
    }
  };

  const setFilterType = (filterType: FilterTypes) => {
    setFilter(filterType);
    handleFilterChange(filterType);
  };

  const isSelectedFilter = (filterType: FilterTypes) =>
    filter === FilterTypes[filterType];

  const filterKeys = Object.keys(FilterTypes).filter(key => isNaN(Number(key)));

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {NotCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterKeys.map(key => {
          const filterType = FilterTypes[key as keyof typeof FilterTypes];
          const href =
            filterType === FilterTypes.All
              ? '#/'
              : `#/${filterType.toLowerCase()}`;

          return (
            <a
              key={filterType}
              href={href}
              className={classNames('filter__link', {
                selected: isSelectedFilter(filterType),
              })}
              data-cy={`FilterLink${key}`}
              onClick={() => setFilterType(filterType as FilterTypes)}
            >
              {filterType}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={NotCompletedTodos === todos.length}
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
