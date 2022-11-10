import React from 'react';
import cn from 'classnames';
import { TodosSelections } from '../../types/TodosSelections';

type Props = {
  setFilterSelector: (selection: TodosSelections) => void;
  remainCompletedTodos: number;
  filterSelector: TodosSelections;
  todosLength: number;
  deleteAllCompletedTodos: () => void;
};

export const TodosSelection: React.FC<Props> = ({
  setFilterSelector,
  remainCompletedTodos,
  filterSelector,
  todosLength,
  deleteAllCompletedTodos,
}) => {
  const remainActiveTodos = todosLength - remainCompletedTodos;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${remainActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterSelector === TodosSelections.All },
          )}
          onClick={() => setFilterSelector(TodosSelections.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterSelector === TodosSelections.Active },
          )}
          onClick={() => setFilterSelector(TodosSelections.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterSelector === TodosSelections.Completed },
          )}
          onClick={() => setFilterSelector(TodosSelections.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={(remainCompletedTodos === 0)
          ? { visibility: 'hidden' }
          : {}}
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
