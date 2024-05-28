import { MouseEventHandler } from 'react';

type BottomButtonsProps = {
  handleFilterAll: MouseEventHandler<HTMLAnchorElement>;
  handleFilterActive: MouseEventHandler<HTMLAnchorElement>;
  handleFilterCompleted: MouseEventHandler<HTMLAnchorElement>;
  filter: string;
};

export const BottomButtons: React.FC<BottomButtonsProps> = ({
  handleFilterAll,
  handleFilterActive,
  handleFilterCompleted,
  filter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === '' ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={handleFilterAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={handleFilterActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={handleFilterCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
