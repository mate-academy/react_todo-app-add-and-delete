/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  onChangeSelect: (event: TodoStatus) => void,
  selectedOption: string,
};

export const Filter: React.FC<Props> = ({
  onChangeSelect = () => {},
  selectedOption,
}) => {
  function addActiveSelectedClass(option: string) {
    return selectedOption === option
      ? classNames('filter__link selected')
      : classNames('filter__link');
  }

  return (
    <nav
      className="filter"
      data-cy="Filter"
    >
      <a
        href="#/"
        className={addActiveSelectedClass(TodoStatus.All)}
        data-cy="FilterLinkAll"
        onClick={() => {
          onChangeSelect(TodoStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={addActiveSelectedClass(TodoStatus.Active)}
        data-cy="FilterLinkActive"
        onClick={() => {
          onChangeSelect(TodoStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={addActiveSelectedClass(TodoStatus.Completed)}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          onChangeSelect(TodoStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
