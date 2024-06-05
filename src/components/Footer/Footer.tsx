import { FC } from 'react';
import { Filters } from '../../App';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  onFilterChange: (type: Filters) => void;
  todos: Todo[];
  filter: Filters;
  filteredTodos: Todo[];
  clearCompleted: () => void;
}

export const Footer: FC<Props> = ({
  todos,
  onFilterChange,
  filter,
  filteredTodos,
  clearCompleted,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const CompletedTodos = filteredTodos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filters.all)}
        >
          {Filters.all}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filters.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filters.active)}
        >
          {Filters.active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filters.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filters.completed)}
        >
          {Filters.completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!CompletedTodos}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
