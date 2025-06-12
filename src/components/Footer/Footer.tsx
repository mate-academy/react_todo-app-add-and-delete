import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOptionType } from '../../types/FilterOptionType';

type FooterProps = {
  todos: Todo[];
  filterOption: FilterOptionType;
  setFilterOption: (value: React.SetStateAction<FilterOptionType>) => void;
  handleClearCompletedTodos: () => void;
  setFocusInput: React.Dispatch<React.SetStateAction<number>>;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterOption,
  setFilterOption,
  handleClearCompletedTodos,
  setFocusInput,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterOption === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterOption('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterOption === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterOption('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterOption === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterOption('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          handleClearCompletedTodos();
          setFocusInput(prev => prev + 1);
        }}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
