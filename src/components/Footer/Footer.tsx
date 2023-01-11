import React, { FunctionComponent, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { FilterType } from '../../types/filterType';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

interface FooterProps {
  todos: Todo[];
  filterBy: FilterType;
  setFilterBy: (filter: FilterType) => void;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;

}
export const Footer: FunctionComponent<FooterProps> = ({
  todos,
  filterBy,
  setFilterBy,
  setSelectedTodosId,
  setErrorMessage,

}) => {
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const removeCompletedTodos = useCallback(async () => {
    try {
      setSelectedTodosId(prevId => ([
        ...prevId,
        ...completedTodos.map(todo => todo.id),
      ]));

      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));
    } catch {
      setErrorMessage(Errors.Deleting);
    }
  }, []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.All,
          })}
          onClick={() => setFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.Active,
          })}
          onClick={() => setFilterBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.Completed,
          })}
          onClick={() => setFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompletedTodos}
        style={(!completedTodos.length)
          ? { visibility: 'hidden' }
          : { visibility: 'visible' }}
      >
        Clear completed
      </button>

    </footer>
  );
};
