import cn from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';

interface Props {
  currentOption: Filter,
  setOption: (value: Filter) => void,
  numberOfActive: number,
  numberOfCompleted: number,
  onClearCompleted: () => void;
}

const options = Object.values(Filter);

export const Footer:React.FC<Props> = ({
  currentOption,
  setOption,
  numberOfActive,
  numberOfCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActive} items left`}
      </span>

      <nav className="filter">
        {options.map(option => (
          <a
            key={option}
            href={`#/${option}`}
            className={cn('filter__link', {
              selected: option === currentOption,
            })}
            onClick={() => setOption(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={onClearCompleted}
        className={cn('todoapp__clear-completed', {
          hidden: !numberOfCompleted,
        })}
      >
        Clear completed
      </button>

    </footer>
  );
};
