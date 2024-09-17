import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { Errors } from '../types/ErrorsTodo';

export const Footer: React.FC = () => {
  const { todos, status, setStatus, deleteTodo, setErrorMessage } = useTodos();
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompleted = async () => {
    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch {
      setErrorMessage(Errors.DeleteTodo);
    } finally {
      setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} item${todosLeft === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
