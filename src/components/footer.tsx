import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface FooterProps {
  counterOfActiveTodos: number;
  filter: string;
  todos: Todo[]; // Предположим, у вас есть тип Todo
  handleFilterChange: (filter: Filter) => void;
  handleDeleteAllCompleted: () => void; // Укажите, что это функция без аргументов
}

export const Footer: React.FC<FooterProps> = ({
  counterOfActiveTodos,
  filter,
  todos,
  handleFilterChange,
  handleDeleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterOfActiveTodos} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.ALL ? 'selected' : ''}`}
          onClick={() => handleFilterChange(Filter.ALL)}
          data-cy="FilterLinkAll"
        >
          All
        </a>
        <a
          href="#/active"
          className={`filter__link ${filter === Filter.ACTIVE ? 'selected' : ''}`}
          onClick={() => handleFilterChange(Filter.ACTIVE)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>
        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.COMPLETED ? 'selected' : ''}`}
          onClick={() => handleFilterChange(Filter.COMPLETED)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
