import React from 'react';
import { SelectOption } from '../../App';
import cn from 'classnames';

type Props = {
  option: SelectOption;
  onSetOption: (v: SelectOption) => void;
};

export const Filter: React.FC<Props> = ({ option, onSetOption }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: option === SelectOption.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onSetOption(SelectOption.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: option === SelectOption.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onSetOption(SelectOption.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: option === SelectOption.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onSetOption(SelectOption.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
