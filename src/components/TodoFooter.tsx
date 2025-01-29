import classNames from 'classnames';
import React from 'react';
import { TypeFilter } from '../App';

interface Props {
  setFilter: (filter: string) => void;
  filter: string;
  listOfActiveTodos: number;
  hasActiveTodo: boolean;
  deleteCompletedTasks: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoFooter: React.FC<Props> = ({
  setFilter,
  filter,
  listOfActiveTodos,
  hasActiveTodo,
  deleteCompletedTasks,
  inputRef,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {listOfActiveTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(TypeFilter).map(filteredVaue => (
          <a
            key={filteredVaue}
            href={`#/${filteredVaue.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === filteredVaue,
            })}
            data-cy={`FilterLink${filteredVaue}`}
            onClick={e => {
              e.preventDefault();
              setFilter(filteredVaue);
            }}
          >
            {filteredVaue}
          </a>
        ))}
      </nav>

      <button
        disabled={!hasActiveTodo}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          deleteCompletedTasks();
          inputRef.current?.focus();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
