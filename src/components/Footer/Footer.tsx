import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<string>>,
  setMustRenderList: React.Dispatch<unknown>
  setFilterBy: React.Dispatch<React.SetStateAction<string>>,
};

export const Footer: React.FC<Props> = ({
  todos, setMustRenderList, setFilterBy, setError,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const completedTodos = todos.filter(todo => todo.completed);

  const handleClickFilter = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (!e.currentTarget.textContent) {
      return;
    }

    setFilterBy(e.currentTarget.textContent.trim());
  };

  const handleClickClearCompleted = () => {
    const iterablePromises = completedTodos
      .map(todo => deleteTodo(todo.id));

    Promise.all(iterablePromises)
      .then(response => setMustRenderList(response))
      .catch(() => {
        setTimeout(() => setError(''));
        setError('Unable to delete all completed todos');
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className="filter__link"
          onClick={handleClickFilter}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className="filter__link"
          onClick={handleClickFilter}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className="filter__link"
          onClick={handleClickFilter}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
        )}
        onClick={handleClickClearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
