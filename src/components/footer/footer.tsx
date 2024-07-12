import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoSatus';

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
          className={cn('filter__link', {
            selected: !status,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onClick('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => onClick(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick(TodoStatus.Completed)}
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
