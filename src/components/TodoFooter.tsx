import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import EFilter from '../utils/EFilter';
import EError from '../utils/EError';

interface ITodoFooter {
  todos: Todo[] | undefined;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (error: EError) => void;
  filter: EFilter;
  setFilter: (filter: EFilter) => void;
}

export const TodoFooter: React.FC<ITodoFooter> = ({
  todos,
  setTodos,
  setErrorMessage,
  filter,
  setFilter,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const todosCounter = todos?.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos?.some(todo => todo.completed);

  const handleDeleteCompleted = async () => {
    try {
      setIsDeleting(true);

      const completedIds = todos?.filter(t => t.completed).map(t => t.id) ?? [];

      const promises = completedIds.map(id =>
        deleteTodo(id)
          .then(() => ({ id, status: 'ok' }))
          .catch(() => ({ id, status: 'error' })),
      );

      const results = await Promise.all(promises);

      const successIds = results
        .filter(result => result.status === 'ok')
        .map(result => result.id);

      setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

      if (results.some(result => result.status === 'error')) {
        setErrorMessage(EError.delete);
      }
    } catch {
      setErrorMessage(EError.delete);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === EFilter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(EFilter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === EFilter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(EFilter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === EFilter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(EFilter.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo || isDeleting}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
