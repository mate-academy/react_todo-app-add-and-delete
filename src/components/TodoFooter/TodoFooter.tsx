import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  handleFilter: (value: TodoStatus) => void,
  handleClearCompleted: () => void,
  activeFilter: TodoStatus,
  completedTodo: number,
  notCompletedTodo: number,
};

export const TodoFooter: React.FC<Props> = ({
  handleFilter,
  handleClearCompleted,
  activeFilter,
  completedTodo,
  notCompletedTodo,
}) => {
  return (
    <>
      <span className="todo-count">
        {`${notCompletedTodo} items left`}
      </span>
      <nav className="filter">
        <a
          href={`#/${TodoStatus.All}`}
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.All,
          })}
          onClick={() => handleFilter(TodoStatus.All)}
        >
          {TodoStatus.All}
        </a>

        <a
          href={`#/${TodoStatus.Active}`}
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.Active,
          })}
          onClick={() => handleFilter(TodoStatus.Active)}
        >
          {TodoStatus.Active}
        </a>

        <a
          href={`#/${TodoStatus.Completed}`}
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.Completed,
          })}
          onClick={() => handleFilter(TodoStatus.Completed)}
        >
          {TodoStatus.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
      >
        {completedTodo > 0 && ('Clear completed')}
      </button>
    </>
  );
};
