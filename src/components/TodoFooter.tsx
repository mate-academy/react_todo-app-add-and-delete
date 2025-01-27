import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoFooterProps {
  todos: Todo[];
  onFilter: (option: string) => void;
  onDeleteCompletedTodo: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  onFilter,
  onDeleteCompletedTodo,
}) => {
  const [option, setOption] = useState('All');
  const countActiveTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleFilterSelect =
    (filter: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setOption(filter);
    };

  const deleteCompleted = () => {
    onDeleteCompletedTodo();
  };

  useEffect(() => {
    onFilter(option);
  }, [option, onFilter]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodo} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${option === 'All' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={handleFilterSelect('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${option === 'Active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={handleFilterSelect('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${option === 'Completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterSelect('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
