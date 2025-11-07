import classNames from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoStatusFilter } from '../types/TodoStatusFilter';

type Props = {
  todos: Todo[];
  selectedFilter: TodoStatusFilter;
  onStatusChange: (status: TodoStatusFilter) => void;
  onDeleteAllCompletedTodos: () => void;
};

export const TodoFooter: FC<Props> = ({
  todos,
  selectedFilter,
  onStatusChange,
  onDeleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === TodoStatusFilter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatusChange(TodoStatusFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === TodoStatusFilter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatusChange(TodoStatusFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === TodoStatusFilter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatusChange(TodoStatusFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onDeleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
