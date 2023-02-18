import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Options } from '../../types/Options';

type Props = {
  setFilterType: Dispatch<SetStateAction<Options>>
  deleteCompletedTodos: () => void,
  completedTodos: boolean
};

export const Footer: React.FC<Props> = React.memo(
  ({ setFilterType, completedTodos, deleteCompletedTodos }) => {
    const [selectedOption, setSelectedOption] = useState<string>(Options.ALL);

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          3 items left
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              { selected: selectedOption === Options.ALL },
            )}
            onClick={() => {
              setFilterType(Options.ALL);
              setSelectedOption(Options.ALL);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              { selected: selectedOption === Options.ACTIVE },
            )}
            onClick={() => {
              setFilterType(Options.ACTIVE);
              setSelectedOption(Options.ACTIVE);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              { selected: selectedOption === Options.COMPLETED },
            )}
            onClick={() => {
              setFilterType(Options.COMPLETED);
              setSelectedOption(Options.COMPLETED);
            }}
          >
            Completed
          </a>
        </nav>

        {completedTodos
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            // disabled={!completedTodos}
            onClick={deleteCompletedTodos}
          >
            Clear completed
          </button>
        )}

      </footer>
    );
  },
);
