import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setTodosToDisplay: (currentTodos: Todo[]) => void;
  onDelete: (id: number) => void;
};

type Filter = 'All' | 'Active' | 'Completed';

export const TodoFooter: React.FC<Props> = ({
  todos,
  setTodosToDisplay,
  onDelete,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');

  const hasNoCompletedTodos = !todos.some(todo => todo.completed);

  //#region filter
  function filterAll() {
    setSelectedFilter('All');
    setTodosToDisplay(todos);
  }

  function filterActive() {
    setSelectedFilter('Active');
    setTodosToDisplay(todos.filter(todo => !todo.completed));
  }

  function filterCompleted() {
    setSelectedFilter('Completed');
    setTodosToDisplay(todos.filter(todo => todo.completed));
  }
  //#endregion

  async function deleteCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={filterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={filterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={filterCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={hasNoCompletedTodos}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
