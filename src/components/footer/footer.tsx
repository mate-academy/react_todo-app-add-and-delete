import { Todo } from '../../types/Todo';

type Props = {
  onClick: (status: string) => void;
  status: string;
  leftItems: number;
  completedItems: Todo[];
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  onClick,
  status,
  leftItems,
  completedItems,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems + ' items left'}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === 'all' && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={() => onClick('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === 'active' && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={() => onClick('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'completed' && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedItems.length > 0 ? false : true}
        onClick={() => onDelete()}
      >
        Clear completed
      </button>
    </footer>
  );
};
