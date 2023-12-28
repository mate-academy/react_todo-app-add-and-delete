/* eslint-disable max-len */
import React, { useContext, useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodoItem } from '../api/todos';
import { ErrorContext, ErrorsMessageContext } from './ErrorsContext';
import { IsfinallyContext } from './TempTodoContext';

type Props = {
  todos: Todo[];
  filter:string;
  setFilter : (filter: string) => void
  setClearedTodoId: (ids: number[]) => void
};
export const Footer : React.FC<Props> = ({
  todos, filter, setFilter, setClearedTodoId,
}) => {
  const noCompletedItems = useMemo(() => todos.filter(el => el.completed === false).length, [todos]);
  const { setIsError } = useContext(ErrorContext);
  const { setErrorsMesage } = useContext(ErrorsMessageContext);
  const { setIsfinally } = useContext(IsfinallyContext);
  const clearCompleted = () => {
    setClearedTodoId(todos.filter(el => el.completed).map(el => el.id));
    todos.forEach(el => {
      if (el.completed) {
        setIsfinally(true);
        deleteTodoItem(el.id)
          .catch(() => {
            setIsError(true);
            setErrorsMesage('delete');
          })
          .finally(() => {
            setIsfinally(false);
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${noCompletedItems} items left`}

      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'All' })}
          data-cy="FilterLinkAll"
          onMouseDown={() => {
            setFilter('All');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'Active' })}
          data-cy="FilterLinkActive"
          onMouseDown={() => {
            setFilter('Active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'Completed' })}
          data-cy="FilterLinkCompleted"
          onMouseDown={() => {
            setFilter('Completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={!todos.some((el) => el.completed === true)}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onMouseDown={clearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
