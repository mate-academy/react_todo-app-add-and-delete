import classNames from 'classnames';
import { useState } from 'react';
import { FilterBy } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  setSortBy: (value: FilterBy) => void;
  clearAllCompleted: () => void;
  completedTodo: Todo[];
};

export const TodoFilter: React.FC<Props> = ({
  setSortBy,
  clearAllCompleted,
  completedTodo,
}) => {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { 'filter__link selected': selectedTab === 'all' })}
          onClick={() => {
            setSortBy(FilterBy.All);
            setSelectedTab('all');
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { 'filter__link selected': selectedTab === 'Active' })}
          onClick={() => {
            setSortBy(FilterBy.Active);
            setSelectedTab('Active');
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { 'filter__link selected': selectedTab === 'Completed' })}
          onClick={() => {
            setSortBy(FilterBy.Completed);
            setSelectedTab('Completed');
          }}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearAllCompleted}
        disabled={completedTodo.length === 0}
      >
        Clear completed
      </button>
    </>
  );
};
