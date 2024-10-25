import classNames from 'classnames';
import React from 'react';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onFilter: (value: string) => void;
  onDelete: (todoList: Todo[]) => void;
}

export const Footer: React.FC<Props> = ({ onFilter, onDelete, todos }) => {
  const [activeLink, setActiveLink] = useState('all');

  const handleFiltering = (filterType: string) => {
    onFilter(filterType);
    setActiveLink(filterType);
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => handleFiltering('all')}
          className={classNames(
            'filter__link',
            activeLink === 'all' && 'selected',
          )}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => handleFiltering('active')}
          className={classNames(
            'filter__link',
            activeLink === 'active' && 'selected',
          )}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => handleFiltering('completed')}
          className={classNames(
            'filter__link',
            activeLink === 'completed' && 'selected',
          )}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        disabled={completedTodos.length === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onDelete(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
