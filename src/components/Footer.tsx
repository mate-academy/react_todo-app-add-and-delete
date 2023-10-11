import { FC, useState } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Todo';

type Props = {
  quantity: number;
  setFilterBy: (par: Filter) => void;
  hasCompleted: boolean;
  deleteCompletedTodos: () => void;
};

export const Footer: FC<Props> = ({
  quantity,
  setFilterBy,
  hasCompleted,
  deleteCompletedTodos,
}) => {
  const [chosenFilter, setChosenFilter] = useState('all');

  return (
    //  {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${quantity} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: chosenFilter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterBy(Filter.all);
            setChosenFilter('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: chosenFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterBy(Filter.active);
            setChosenFilter('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: chosenFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterBy(Filter.completed);
            setChosenFilter('completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={{
          opacity: hasCompleted ? 1 : 0,
          pointerEvents: hasCompleted ? 'all' : 'none',
        }}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
