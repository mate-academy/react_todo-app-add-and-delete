import classNames from 'classnames';
import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

type Props = {
  status: string;
  activeItems: Todo[];
  complitedItems: Todo[];
  onClick: (status: TodoStatus) => void;
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  status,
  activeItems,
  complitedItems,
  onClick,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeItems.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: status === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onClick(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={complitedItems.length === 0}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
