import classNames from 'classnames';

export enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type Props = {
  incompleteTodoQuantity: number;
  onFilterSelect: (filterType: TodoStatus) => void;
  activeFiltering: TodoStatus;
  onDeleteCompleted: () => void;
  isDeleteCompletedButtonDisabled: boolean;
};

export const Footer: React.FC<Props> = ({
  incompleteTodoQuantity,
  onFilterSelect,
  activeFiltering,
  onDeleteCompleted,
  isDeleteCompletedButtonDisabled,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteTodoQuantity} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {/*
          I don't like this, and with Object.keys
          the TodoStatus[status] doesn't work that easy.
        */}
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            href={`#/${status === TodoStatus.All ? '' : status}`}
            data-cy={`FilterLink${status}`}
            onClick={() => onFilterSelect(status)}
            className={classNames('filter__link', {
              selected: activeFiltering === status,
            })}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={isDeleteCompletedButtonDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
};
