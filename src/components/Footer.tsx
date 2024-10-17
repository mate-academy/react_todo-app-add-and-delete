import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOptions } from '../enums/FilterOptions';
import { Dispatch, FC, SetStateAction } from 'react';

interface FooterProps {
  todos: Todo[];
  completedTodos: Todo[];
  filter: FilterOptions;
  setFilter: Dispatch<SetStateAction<FilterOptions>>;
  onCompletedTodosDeleted: () => void;
}

export const Footer: FC<FooterProps> = ({
  todos,
  completedTodos,
  filter,
  setFilter,
  onCompletedTodosDeleted,
}) => {
  const atLeastOneIsActive = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(filterOption => (
          <a
            key={filterOption}
            href={`#/${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onCompletedTodosDeleted}
        disabled={!atLeastOneIsActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
