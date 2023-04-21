import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todoStatus: TodoStatus;
  setTodoStatus: (status: TodoStatus) => void;
  onClearComponent: () => void;
  notCompletedTodo: number;
  completedTodo: number;
};

export const Footer: React.FC<Props> = ({
  todoStatus,
  setTodoStatus,
  onClearComponent,
  notCompletedTodo,
  completedTodo,
}) => {
  const onFilterChange = (filter: TodoStatus) => () => {
    setTodoStatus(filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${notCompletedTodo} items left`}
      </span>

      <nav className="filter">
        <a
          href={`#/${TodoStatus.ALL}`}
          className={classNames(
            'filter__link',
            { selected: todoStatus === TodoStatus.ALL },
          )}
          onClick={onFilterChange(TodoStatus.ALL)}
        >
          {TodoStatus.ALL}
        </a>

        <a
          href={`#/${TodoStatus.ACTIVE}`}
          className={classNames(
            'filter__link',
            { selected: todoStatus === TodoStatus.ACTIVE },
          )}
          onClick={onFilterChange(TodoStatus.ACTIVE)}
        >
          {TodoStatus.ACTIVE}
        </a>

        <a
          href={`#/${TodoStatus.COMPLETED}`}
          className={classNames(
            'filter__link',
            { selected: todoStatus === TodoStatus.COMPLETED },
          )}
          onClick={onFilterChange(TodoStatus.COMPLETED)}
        >
          {TodoStatus.COMPLETED}
        </a>
      </nav>

      {completedTodo > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearComponent}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
