import { FC } from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type TFooterProps = {
  setSelectedStatus: (newValue: TodoStatus) => void;
  atleastOneTodoCompleted: boolean;
  selectedStatus: TodoStatus;
  countOfNotCompletedTodo: number;
  onDeleteCompleted: () => Promise<void>
};

export const Footer: FC<TFooterProps> = ({
  setSelectedStatus,
  selectedStatus,
  atleastOneTodoCompleted,
  countOfNotCompletedTodo,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfNotCompletedTodo} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedStatus === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedStatus === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedStatus === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!atleastOneTodoCompleted}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
