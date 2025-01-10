import React from 'react';
import { Todo } from '../types/Todo';

interface TodoFooterProps {
  todos: Todo[];
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  clearCompletedTodos: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <button
          type="button"
          className={`filter__link ${selectedFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`filter__link ${selectedFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter('active')}
        >
          Active
        </button>
        <button
          type="button"
          className={`filter__link ${selectedFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter('completed')}
        >
          Completed
        </button>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
