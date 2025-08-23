import { TodosStatus } from '../TodoApp';
import cn from 'classnames';

interface Props {
  itemsCount: number;
  activeStatus: TodosStatus;
  onStatusChange: (status: TodosStatus) => void;
  noCompletedTodos: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  itemsCount,
  activeStatus,
  onStatusChange,
  noCompletedTodos,
  onClearCompleted,
}) => {
  const statusLabels = {
    [TodosStatus.ALL]: 'all',
    [TodosStatus.ACTIVE]: 'active',
    [TodosStatus.COMPLETED]: 'completed',
  };

  const handleFilterByStatus = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    status: TodosStatus,
  ) => {
    e.preventDefault();

    onStatusChange(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {(Object.keys(TodosStatus) as (keyof typeof TodosStatus)[])
          .filter(key => isNaN(Number(key)))
          .map(key => {
            const status = TodosStatus[key as keyof typeof TodosStatus];
            const isActive = status === activeStatus;

            const capitalisedNameForStatus =
              statusLabels[status][0].toUpperCase() +
              statusLabels[status].slice(1);

            return (
              <a
                key={key}
                href={`#/${key}`}
                className={cn('filter__link', { selected: isActive })}
                data-cy={`FilterLink${key[0] + key.slice(1).toLowerCase()}`}
                onClick={event => handleFilterByStatus(event, status)}
              >
                {capitalisedNameForStatus}
                {/* {statusLabels[status]} */}
              </a>
            );
          })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={noCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
