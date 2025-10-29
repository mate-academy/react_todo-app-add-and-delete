import { FC } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Completed } from '../types/Completed';

type Props = {
  todos: Todo[];
  selectedFilter: Completed;
  onDeleteCompleted: () => void;
  changeSelectedFilter: (completed: Completed) => void;
};

export const TodoFooter: FC<Props> = ({
  todos,
  selectedFilter,
  onDeleteCompleted,
  changeSelectedFilter,
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
            selected: selectedFilter === Completed.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeSelectedFilter(Completed.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Completed.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeSelectedFilter(Completed.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Completed.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeSelectedFilter(Completed.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
