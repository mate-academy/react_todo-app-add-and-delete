import React from 'react';
import classNames from 'classnames';
import { Completion } from '../types/Completion';

type Props = {
  completionFilter: Completion,
  setCompletionFilter: (newValue: Completion) => void,
};

export const TodoFilter: React.FC<Props> = ({
  completionFilter,
  setCompletionFilter,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: completionFilter === Completion.All,
      })}
      onClick={() => setCompletionFilter(Completion.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: completionFilter === Completion.Active,
      })}
      onClick={() => setCompletionFilter(Completion.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: completionFilter === Completion.Completed,
      })}
      onClick={() => setCompletionFilter(Completion.Completed)}
    >
      Completed
    </a>
  </nav>
);
