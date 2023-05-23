import React from 'react';
import classnames from 'classnames';
import { TodoStatus } from './types/Todo';

type Props = {
  onStatusFilter: (status:TodoStatus) => void;
  todosQuantity: number;
  statusFilter: TodoStatus;
  completedTodosCount: number;
  onDeleteCompletedTodos: () => void;
};

export const TodosFooter:React.FC<Props> = ({
  onStatusFilter,
  todosQuantity,
  statusFilter,
  completedTodosCount,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosQuantity - completedTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classnames('filter__link', {
            selected: statusFilter === TodoStatus.All,
          })}
          onClick={() => onStatusFilter(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames('filter__link', {
            selected: statusFilter === TodoStatus.Uncompleted,
          })}
          onClick={() => onStatusFilter(TodoStatus.Uncompleted)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames('filter__link', {
            selected: statusFilter === TodoStatus.Completed,
          })}
          onClick={() => onStatusFilter(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onDeleteCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
