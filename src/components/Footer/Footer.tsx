import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { getActiveItems, getCompletedItems } from '../../utils/getItems';
import { Todo } from '../../types/Todo';

interface FooterProps {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onDeleteCompleted: (ids: number[]) => void;
}

export const Footer: FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  onDeleteCompleted,
}) => {
  const countActiveTodos = getActiveItems<Todo>(todos);
  const completedTodos = getCompletedItems<Todo>(todos);

  const handleDeleteCompletedTodo = useCallback(() => {
    onDeleteCompleted(completedTodos);
  }, [completedTodos, onDeleteCompleted]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodo}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
