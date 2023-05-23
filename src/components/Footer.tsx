import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterEnum';

interface Props {
  visibleTodos: Todo[];
  filterBy:FilterBy;
  setFilterBy:React.Dispatch<React.SetStateAction<FilterBy>>;
}

export const Footer: FC<Props> = ({
  visibleTodos,
  filterBy,
  setFilterBy,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Completed,
          })}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      {visibleTodos.some((todo) => todo.completed) && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
