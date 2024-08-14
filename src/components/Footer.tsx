import React from 'react';
import { FILTER_STATUS } from '../App';
import cn from 'classnames';

type Props = {
  todoCounter: number;
  fillterStatus: string;
  setFilterStatus: (v: FILTER_STATUS) => void;
  clearButton: boolean;
  clearAllCopmpleted: (v: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Footer: React.FC<Props> = ({
  todoCounter,
  fillterStatus,
  setFilterStatus,
  clearButton,
  clearAllCopmpleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounter} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FILTER_STATUS).map(el => {
          return (
            <a
              key={el}
              onClick={() => setFilterStatus(el)}
              href="#/"
              className={`filter__link ${cn({ selected: fillterStatus === el })}`}
              data-cy={`FilterLink${el}`}
            >
              {el}
            </a>
          );
        })}
      </nav>
      <button
        disabled={clearButton}
        onClick={clearAllCopmpleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
