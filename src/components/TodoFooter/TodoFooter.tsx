import cn from 'classnames';
import { ErrorMessages, FilterStatus, Todo } from '../../types';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  filteredTodos: Todo[];
  quantityActiveTasks: number;
  inputRef: React.RefObject<HTMLInputElement>;
  activeFilterStatus: string;

  onChangeFilter: (type: FilterStatus) => void;
  onSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onSetError: (error: ErrorMessages) => void;
  onSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const TodoFooter: React.FC<Props> = ({
  filteredTodos,
  activeFilterStatus,
  inputRef,
  quantityActiveTasks,

  onChangeFilter,
  onSetPreparedTodos,
  onSetError,
  onSetTodoIdLoading,
}) => {
  const { handleDeleteAllCompletedTodos } = useDeleteTodos({
    filteredTodos,
    inputRef,
    onSetPreparedTodos,
    onSetError,
    onSetTodoIdLoading,
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${quantityActiveTasks} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={quantityActiveTasks === filteredTodos.length}
        onClick={handleDeleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
