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

        <nav className="filter">
          { Object.values(Options).map(option => (
            <a
              key={option}
              href={`#/${option.toLowerCase()}`}
              className={classNames(
                'filter__link',
                { selected: selectedOption === option },
              )}
              onClick={() => {
                setFilterType(option);
                setSelectedOption(option);
              }}
            >
              {option}
            </a>
          ))}
        </nav>

        {completedTodos
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={deleteCompletedTodos}
          >
            Clear completed
          </button>
        )}

      </footer>
    );
  },
);
