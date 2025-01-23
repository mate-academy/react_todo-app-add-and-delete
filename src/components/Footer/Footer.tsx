import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { clearCompleted, filterClick, FilterEnum } from '../../api/todos';

interface FooterProps {
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterEnum>>;
  completedLentgh: number;
  allTodos: Todo[];
  setCompletedLentgh: React.Dispatch<React.SetStateAction<number>>;
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Footer: React.FC<FooterProps> = ({
  selectedFilter,
  setSelectedFilter,
  completedLentgh,
  allTodos,
  setAllTodos,
  setError,
  setErrorMessage,
  setLoading,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedLentgh} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterEnum).map((curFilter, index) => {
          return (
            <a
              data-cy={`FilterLink${curFilter.charAt(0).toUpperCase() + curFilter.slice(1)}`}
              key={index}
              href={curFilter === FilterEnum.ALL ? '#/' : `#/${curFilter}`}
              className={classNames('filter__link', {
                selected: selectedFilter === curFilter,
              })}
              onClick={() => {
                filterClick(
                  setSelectedFilter,
                  curFilter,
                  selectedFilter,
                  allTodos,
                );
              }}
            >
              {curFilter.charAt(0).toUpperCase() + curFilter.slice(1)}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!allTodos.some(todo => todo.completed)}
        onClick={() => {
          clearCompleted(
            allTodos,
            setAllTodos,
            setError,
            setErrorMessage,
            setLoading,
          );
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
