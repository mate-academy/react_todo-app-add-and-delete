import React from 'react';
import { useTodos } from '../utils/TodoContext';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { ErrText } from '../types/ErrText';

export const Foofer: React.FC = () => {
  const { todos, status, setStatus, deleteTodo, setErrMessage } = useTodos();
  const itemsLeft = todos.filter(el => !el.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompleted = async () => {
    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch {
      setErrMessage(ErrText.DeleteErr);
    } finally {
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
        {itemsLeft > 1 ? ' items ' : ' item '}
        left
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
