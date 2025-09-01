import React, { useState } from 'react';
import cn from 'classnames';
import { FilterOptions } from '../types/enums';

type Props = {
  onSetfilterType: (value: FilterOptions) => void;
  handleDeleteCompleted: () => void;
  completedLength: number;
};

const Footer: React.FC<Props> = ({
  onSetfilterType,
  handleDeleteCompleted,
  completedLength,
}) => {
  const [selectedType, setSelectedType] = useState(FilterOptions.All);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        3 items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedType === FilterOptions.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            onSetfilterType(FilterOptions.All);
            setSelectedType(FilterOptions.All);
          }}
        >
          {FilterOptions.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedType === FilterOptions.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            onSetfilterType(FilterOptions.Active);
            setSelectedType(FilterOptions.Active);
          }}
        >
          {FilterOptions.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedType === FilterOptions.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            onSetfilterType(FilterOptions.Completed);
            setSelectedType(FilterOptions.Completed);
          }}
        >
          {FilterOptions.Completed}
        </a>
      </nav>

      {/* TODO: this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        disabled={completedLength === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
