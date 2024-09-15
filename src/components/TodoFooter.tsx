import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from './Todos-Context';
import { Status } from '../utils/TodosFilter';
import { deleteTodos } from '../api/todos';

export const TodoFooter: React.FC = () => {
  const {
    setFiltred,
    todos,
    setTodos,
    filtred,
    setDeletingTodos,
    setErrorMessage,
  } = useContext(TodosContext);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const findCompleted = todos.some(todo => todo.completed);

  const filterByStatus = (status: Status) => {
    setFiltred(status);
  };

  const handleClear = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodos(todo.userId, todo.id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
          })
          .finally(() => {
            setDeletingTodos([]);
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filtred === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterByStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filtred === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterByStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filtred === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterByStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClear}
        disabled={!findCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
