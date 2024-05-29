/* eslint-disable prettier/prettier */
import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  setFilter: Dispatch<SetStateAction<Filter>>;
  filter: Filter;
  todos: Todo[];
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  filter,
  todos,
  deleteAllCompleted,
}) => {
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
