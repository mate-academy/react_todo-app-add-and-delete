import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: Filters,
  setFilterBy: (item: Filters) => void,
};

export const Footer: FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilterBy,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasSomeTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
