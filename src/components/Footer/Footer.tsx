import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { deleteTodo } from '../../api/todos';

type Props = {
  typeOfFilter: string;
  setTypeOfFilter: (filter: string) => void;
  todos: Todo[];
  completedTodoList: Todo[];
};

export const Footer: React.FC<Props> = ({
  typeOfFilter,
  setTypeOfFilter,
  todos,
  completedTodoList,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const deleteFinishedTodos = () => todos.forEach(todo => {
    if (todo.completed) {
      deleteTodo(todo.id);
    }
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: typeOfFilter === FilterType.All },
          )}
          onClick={() => setTypeOfFilter(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: typeOfFilter === FilterType.Active },
          )}
          onClick={() => setTypeOfFilter(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: typeOfFilter === FilterType.Completed },
          )}
          onClick={() => setTypeOfFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteFinishedTodos}
      >
        {completedTodoList.length === 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
