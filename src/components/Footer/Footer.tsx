import React from 'react';
import { Todo } from '../../types/Todo';

interface FooterProps {
  todos: Todo[];
  status: 'all' | 'active' | 'completed';
  setStatus: (status: 'all' | 'active' | 'completed') => void;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  status,
  setStatus,
  handleClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  if (todos.length === 0) {
    return null;
  }

  return (
    // Приховати нижній колонтитул, якщо немає списку завдань
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Активне посилання повинно мати клас «вибраний» */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus('completed')}
        >
          Completed
        </a>
      </nav>

      {/* цю кнопку слід вимкнути, якщо немає виконаних завдань */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
