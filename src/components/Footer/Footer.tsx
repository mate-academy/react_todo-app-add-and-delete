import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  todos: Todo[],
  filterBy: FilterBy,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
  setIsClickClearComleted: React.Dispatch<React.SetStateAction<boolean>>,
};

export const Footer: React.FC<Props> = ({
  todos, filterBy, setTodos, setFilterBy, setError, setIsClickClearComleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const completedTodosId = todos.filter(todo => todo.completed)
    .map(todo => todo.id);

  const handleClickFilter = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (!e.currentTarget.textContent) {
      return;
    }

    const property = e.currentTarget.textContent as keyof typeof FilterBy;

    setFilterBy(FilterBy[property]);
  };

  const handleClickClearCompleted = () => {
    setIsClickClearComleted(true);
    const iterablePromises = completedTodosId
      .map(id => deleteTodo(id));

    Promise.all(iterablePromises)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => !completedTodosId.includes(todo.id))))
      .catch(() => {
        setTimeout(() => setError(''));
        setError('Unable to delete all completed todos');
      })
      .finally(() => setIsClickClearComleted(false));
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
          className={classNames(
            'filter__link',
            { 'filter__link--selected': filterBy === 'All' },
          )}
          onClick={handleClickFilter}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { 'filter__link--selected': filterBy === 'Active' },
          )}
          onClick={handleClickFilter}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { 'filter__link--selected': filterBy === 'Completed' },
          )}
          onClick={handleClickFilter}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClickClearCompleted}
        disabled={completedTodosId.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
